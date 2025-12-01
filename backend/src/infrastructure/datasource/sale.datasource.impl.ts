import { prisma } from '@/data/postgresql';
import { SaleDatasource } from '@/domain/datasources/sale.datasource';
import { CreateSaleDtoType } from '@/domain/dtos/sales/create-sale.dto';
import { SaleEntity } from '@/domain/entities/sale.entity';
import { UserRoleService } from '../services/user-role.service';
import { BadRequestException } from '@/shared/exceptions/bad-request';
import { CancelSaleDtoType } from '@/domain/dtos/sales/cancel-sale.dto';
import { MovementReason, MovementType, SaleState } from '@/generated/enums';
import { Prisma } from '@/generated/client';
import { SalesReportDtoType } from '@/domain/dtos/sales/sales-report.dto';

const userRoleService = new UserRoleService(prisma);

export const saleDatasourceImplementation: SaleDatasource = {
  async getAll(): Promise<SaleEntity[]> {
    return await prisma.sale.findMany({
      include: { saleProducts: true },
    });
  },

  async findById(id: number): Promise<SaleEntity> {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: { saleProducts: true },
    });

    if (!sale) throw new BadRequestException('No se encontró la venta.');

    return sale;
  },

  async createSale(data: CreateSaleDtoType): Promise<SaleEntity> {
    const { products, ...saleData } = data;

    await userRoleService.validateUserRole(saleData.cashierId, 'cashier');

    const productIds = products.map((p) => p.productId);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, state: 'active' },
      select: { id: true, name: true, stock: true, price: true },
    });

    if (existingProducts.length !== products.length) {
      throw new BadRequestException(
        'Hay productos inválidos o inactivos en la venta.'
      );
    }

    // validar stock para cada producto
    for (const saleProduct of products) {
      const product = existingProducts.find(
        (p) => p.id === saleProduct.productId
      );

      if (!product) {
        throw new BadRequestException(
          `Producto con ID ${saleProduct.productId} no encontrado.`
        );
      }

      if (product.stock < saleProduct.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Requerido: ${saleProduct.quantity}`
        );
      }
    }

    return await prisma.$transaction(async (tx) => {
      // Calcular total automáticamente
      let totalAmount: number = 0;

      for (const saleProduct of products) {
        await tx.product.update({
          where: { id: saleProduct.productId },
          data: {
            stock: {
              decrement: saleProduct.quantity,
            },
          },
        });

        const product = existingProducts.find(
          (p) => p.id === saleProduct.productId
        );
        totalAmount += Number(product!.price) * saleProduct.quantity;

        await tx.inventoryMovement.create({
          data: {
            productId: saleProduct.productId,
            quantity: saleProduct.quantity,
            movementType: MovementType.out,
            reason: MovementReason.sale,
            adminId: saleData.cashierId,
            createdAt: new Date(),
          },
        });
      }

      const newSale = await tx.sale.create({
        data: {
          ...saleData,
          totalAmount, // Calculado automáticamente
          state: SaleState.sold,
          saleProducts: {
            create: products.map((p) => {
              const product = existingProducts.find(
                (prod) => prod.id === p.productId
              );
              return {
                productId: p.productId,
                quantity: p.quantity,
                unitPrice: product!.price,
              };
            }),
          },
        },
        include: { saleProducts: true },
      });

      return newSale;
    });
  },

  async cancelSale(id: number, dto: CancelSaleDtoType): Promise<SaleEntity> {
    await this.findById(id);
    const { cashierId } = dto;

    await userRoleService.validateUserRole(cashierId, 'cashier');

    return await prisma.$transaction(async (tx) => {
      const saleWithProducts = await tx.sale.findUnique({
        where: { id },
        include: { saleProducts: true },
      });

      if (!saleWithProducts) {
        throw new BadRequestException('Venta no encontrada.');
      }

      // devolver stock de cada producto
      for (const saleProduct of saleWithProducts.saleProducts) {
        await tx.product.update({
          where: { id: saleProduct.productId },
          data: {
            stock: {
              increment: saleProduct.quantity,
            },
          },
        });

        // entrada por devolución
        await tx.inventoryMovement.create({
          data: {
            productId: saleProduct.productId,
            quantity: saleProduct.quantity,
            movementType: MovementType.in,
            reason: MovementReason.return,
            adminId: cashierId,
            createdAt: new Date(),
          },
        });
      }

      const canceledSale = await tx.sale.update({
        where: { id },
        data: {
          cashierId,
          state: SaleState.cancel,
        },
        include: { saleProducts: true },
      });

      return canceledSale;
    });
  },

  async deleteSale(id: number): Promise<SaleEntity> {
    await this.findById(id);

    return await prisma.sale.delete({
      where: { id },
    });
  },

  async getSalesReport(dto?: SalesReportDtoType): Promise<SaleEntity[]> {
    const where: Prisma.SaleWhereInput = {};

    if (dto?.cashierId) where.cashierId = dto.cashierId;
    if (dto?.state) where.state = dto.state;

    if (dto?.startDate || dto?.endDate) {
      where.createdAt = {};

      if (dto.startDate) {
        const start = new Date(dto.startDate);
        start.setUTCHours(0, 0, 0, 0);
        where.createdAt.gte = start;
      }
      if (dto.endDate) {
        const end = new Date(dto.endDate);
        end.setUTCHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    return await prisma.sale.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: { saleProducts: true },
    });
  },
};
