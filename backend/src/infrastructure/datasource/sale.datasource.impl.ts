import { Prisma } from '@/generated/client';
import {
  MovementReason,
  MovementType,
  ProductState,
  SaleState,
  UserRole,
} from '@/generated/enums';
import { prisma } from '@/data/postgresql';

import { SaleEntity } from '@/domain/entities/sale.entity';
import { SaleDatasource } from '@/domain/datasources/sale.datasource';

import { CreateSaleDtoType } from '@/domain/dtos/sales/create-sale.dto';
import { SalesReportDtoType } from '@/domain/dtos/sales/sales-report.dto';

import { UserRoleService } from '../services/user-role.service';
import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

const productSelectBasic = {
  id: true,
  name: true,
  price: true,
} as const;

const userSelectBasic = {
  id: true,
  name: true,
  lastName: true,
  username: true,
  phoneNumber: true,
} as const;

const userRoleService = new UserRoleService(prisma);

export const saleDatasourceImplementation: SaleDatasource = {
  async getAll(): Promise<SaleEntity[]> {
    return await prisma.sale.findMany({
      include: {
        saleProducts: {
          include: { product: { select: productSelectBasic } },
        },
        cashier: { select: userSelectBasic },
      },
    });
  },

  async findById(id: number): Promise<SaleEntity> {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        saleProducts: {
          include: { product: { select: productSelectBasic } },
        },
        cashier: { select: userSelectBasic },
      },
    });

    if (!sale) throw new BadRequestException(messages.sale.notFound());

    return sale;
  },

  async createSale(
    data: CreateSaleDtoType,
    cashierId: number
  ): Promise<SaleEntity> {
    const { products } = data;

    await userRoleService.validateUserRole(cashierId, UserRole.cashier);

    const productIds = products.map((p) => p.productId);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, state: ProductState.active },
      select: { id: true, name: true, stock: true, price: true },
    });

    if (existingProducts.length !== products.length) {
      throw new BadRequestException(messages.product.invalidOrInactive());
    }

    const productMap = new Map(existingProducts.map((p) => [p.id, p]));

    for (const saleProduct of products) {
      const product = productMap.get(saleProduct.productId)!;

      if (product.stock < saleProduct.quantity) {
        throw new BadRequestException(
          messages.product.insufficientStock(
            product.name,
            product.stock,
            saleProduct.quantity
          )
        );
      }
    }

    return await prisma.$transaction(async (tx) => {
      const productMap = new Map(existingProducts.map((p) => [p.id, p]));
      const currentDate = new Date();

      let totalAmount = 0;
      const saleProductsData = products.map((p) => {
        const product = productMap.get(p.productId)!;
        totalAmount += Number(product.price) * p.quantity;

        return {
          productId: p.productId,
          quantity: p.quantity,
          price: product.price,
        };
      });

      await Promise.all(
        products.map((p) =>
          tx.product.update({
            where: { id: p.productId },
            data: { stock: { decrement: p.quantity } },
          })
        )
      );

      await tx.inventoryMovement.createMany({
        data: products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
          movementType: MovementType.out,
          reason: MovementReason.sale,
          adminId: cashierId,
          createdAt: currentDate,
        })),
      });

      const newSale = await tx.sale.create({
        data: {
          cashierId,
          paymentMethod: data.paymentMethod,
          totalAmount,
          state: SaleState.sold,
          saleProducts: { create: saleProductsData },
        },
        include: {
          saleProducts: {
            include: { product: { select: productSelectBasic } },
          },
          cashier: { select: userSelectBasic },
        },
      });

      return newSale;
    });
  },

  async cancelSale(id: number, cashierId: number): Promise<SaleEntity> {
    const existingSale = await prisma.sale.findUnique({
      where: { id },
      select: { state: true },
    });

    if (!existingSale) {
      throw new BadRequestException(messages.sale.notFound());
    }

    await userRoleService.validateUserRole(cashierId, UserRole.cashier);

    return await prisma.$transaction(async (tx) => {
      const saleWithProducts = await tx.sale.findUnique({
        where: { id },
        include: { saleProducts: true },
      });

      if (!saleWithProducts) {
        throw new BadRequestException(messages.sale.notFound());
      }

      const currentDate = new Date();

      await Promise.all(
        saleWithProducts.saleProducts.map((p) =>
          tx.product.update({
            where: { id: p.productId },
            data: { stock: { increment: p.quantity } },
          })
        )
      );

      await tx.inventoryMovement.createMany({
        data: saleWithProducts.saleProducts.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
          movementType: MovementType.in,
          reason: MovementReason.return_from_customer,
          adminId: cashierId,
          createdAt: currentDate,
        })),
      });

      const canceledSale = await tx.sale.update({
        where: { id },
        data: {
          state: SaleState.cancelled,
          cancelledAt: new Date(),
        },
        include: {
          saleProducts: {
            include: { product: { select: productSelectBasic } },
          },
          cashier: { select: userSelectBasic },
        },
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
      include: {
        saleProducts: {
          include: { product: { select: productSelectBasic } },
        },
        cashier: { select: userSelectBasic },
      },
    });
  },
};
