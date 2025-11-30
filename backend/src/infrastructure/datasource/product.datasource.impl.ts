import { prisma } from '@/data/postgresql';
import { ProductDatasource } from '@/domain/datasources/product.datasource';
import { CreateProductDtoType } from '@/domain/dtos/products/create-product.dto';
import { InventoryMovementReportDtoType } from '@/domain/dtos/products/inventory/inventory-movement-report.dto';
import { ProductReportDtoType } from '@/domain/dtos/products/inventory/product-report.dto';
import { StockAlertDtoType } from '@/domain/dtos/products/inventory/stock-alert.dto';
import { UpdateProductDtoType } from '@/domain/dtos/products/update-product.dto';
import { ProductEntity } from '@/domain/entities/product.entity';
import { BadRequestException } from '@/shared/exceptions/bad-request';
import { InventoryMovement, Prisma } from '@/generated/client';
import { MovementReason, MovementType, ProductState } from '@/generated/enums';
import { PrismaClientKnownRequestError } from '@/generated/internal/prismaNamespace';

const handleForeignKeyError = (error: any): never => {
  if (
    error instanceof PrismaClientKnownRequestError &&
    error.code === 'P2003'
  ) {
    const field = (error.meta?.field as string)?.toLowerCase() ?? '';

    if (field.includes('category')) {
      throw new BadRequestException('La categoría proporcionada no existe.');
    }

    if (field.includes('provider')) {
      throw new BadRequestException('El proveedor proporcionado no existe.');
    }

    throw new BadRequestException('Uno de los valores asociados no es válido.');
  }
  throw error;
};

export const productDatasourceImplementation: ProductDatasource = {
  async getAll(): Promise<ProductEntity[]> {
    return await prisma.product.findMany();
  },

  async findById(id: number): Promise<ProductEntity> {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new BadRequestException('No se encontró el producto.');
    }

    return product;
  },

  async create(data: CreateProductDtoType): Promise<ProductEntity> {
    const { expirationDate, image, ...rest } = data;

    try {
      return await prisma.product.create({
        data: {
          ...rest,
          image: image ?? null,
          expirationDate: expirationDate ? new Date(expirationDate) : null,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2003') {
        handleForeignKeyError(error);
      }
      throw error;
    }
  },

  async update(id: number, data: UpdateProductDtoType): Promise<ProductEntity> {
    await this.findById(id);

    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_key, value]) => value !== undefined)
      );

      const updateData: Prisma.ProductUpdateInput = { ...filteredData };

      if ('expirationDate' in updateData) {
        updateData.expirationDate = updateData.expirationDate
          ? new Date(updateData.expirationDate as string)
          : null;
      }

      if ('image' in updateData) {
        updateData.image = (updateData.image as string) ?? null;
      }

      return await prisma.product.update({
        where: { id },
        data: updateData,
      });
    } catch (error: any) {
      return handleForeignKeyError(error);
    }
  },

  async delete(id: number): Promise<ProductEntity> {
    await this.findById(id);

    return await prisma.product.delete({ where: { id } });
  },

  async updateState(id: number, state: ProductState): Promise<ProductEntity> {
    await this.findById(id);

    return await prisma.product.update({
      where: { id },
      data: { state },
    });
  },

  async addStockMovement(params: {
    productId: number;
    adminId: number;
    providerId: number;
    quantity: number;
    type: MovementType;
    date: Date;
    reason: MovementReason | null;
  }): Promise<void> {
    try {
      await prisma.inventoryMovement.create({
        data: {
          productId: params.productId,
          adminId: params.adminId,
          movementType: params.type,
          quantity: params.quantity,
          reason: params.reason,
          createdAt: params.date,
        },
      });
    } catch (error: any) {
      throw new BadRequestException(
        'El administrador no existe o no es válido.'
      );
    }
  },

  async getStockAlerts(dto?: StockAlertDtoType): Promise<ProductEntity[]> {
    const threshold = dto?.threshold ?? 50;

    return await prisma.product.findMany({
      where: { stock: { lte: threshold } },
    });
  },

  async getInventoryMovementReport(
    dto: InventoryMovementReportDtoType
  ): Promise<InventoryMovement[]> {
    const where: Prisma.InventoryMovementWhereInput = {};

    if (dto.startDate || dto.endDate) {
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

    if (dto.productId) {
      where.productId = dto.productId;
    }

    return prisma.inventoryMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  },

  async getInventoryReport(
    dto?: ProductReportDtoType
  ): Promise<ProductEntity[]> {
    const where: Prisma.ProductWhereInput = {};

    if (dto?.categoryId) where.categoryId = dto.categoryId;
    if (dto?.providerId) where.providerId = dto.providerId;
    if (dto?.state) where.state = dto.state;

    return await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  },
};
