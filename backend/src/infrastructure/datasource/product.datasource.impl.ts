import { InventoryMovement } from '@/generated/client';
import { MovementReason, MovementType } from '@/generated/enums';
import { prisma } from '@/data/postgresql';

import { CreateProductDtoType } from '@/domain/dtos/products/create-product.dto';
import { InventoryReportDtoType } from '@/domain/dtos/products/inventory/inventory-movement-report.dto';
import { StockAlertDtoType } from '@/domain/dtos/products/inventory/stock-alert.dto';
import { UpdateProductDtoType } from '@/domain/dtos/products/update-product.dto';

import { ProductDatasource } from '@/domain/datasources/product.datasource';
import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductReportDtoType } from '@/domain/dtos/products/inventory/product-report.dto';

export const productDatasourceImplementation: ProductDatasource = {
  async getAll(): Promise<ProductEntity[]> {
    const products = await prisma.product.findMany();

    return products;
  },

  async findById(id: number): Promise<ProductEntity> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new Error(`No se encontró el producto ${id}`);

    return product;
  },

  async create(createProductDTO: CreateProductDtoType): Promise<ProductEntity> {
    const { expirationDate, image, ...rest } = createProductDTO;

    try {
      const newProduct = await prisma.product.create({
        data: {
          ...rest,
          image: image ?? null,
          expirationDate: expirationDate ? new Date(expirationDate) : null,
        },
      });

      return newProduct;
    } catch (error: any) {
      if (error.code === 'P2003') {
        const raw = JSON.stringify(error);

        if (
          raw.includes('category_id') ||
          raw.includes('categoryId') ||
          raw.toLowerCase().includes('category')
        ) {
          throw new Error('La categoría proporcionada no existe.');
        }

        if (
          raw.includes('provider_id') ||
          raw.includes('providerId') ||
          raw.toLowerCase().includes('provider')
        ) {
          throw new Error('El proveedor proporcionado no existe.');
        }

        throw new Error('Uno de los valores asociados no es válido.');
      }

      throw error;
    }
  },

  async delete(id: number): Promise<ProductEntity> {
    await this.findById(id);

    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    return deletedProduct;
  },

  async update(
    id: number,
    updateProductDTO: UpdateProductDtoType
  ): Promise<ProductEntity> {
    await this.findById(id);

    try {
      const filteredData = Object.fromEntries(
        Object.entries(updateProductDTO).filter(
          ([_key, value]) => value !== undefined
        )
      ) as Partial<UpdateProductDtoType>;

      const data: any = { ...filteredData };

      if ('expirationDate' in data) {
        data.expirationDate = data.expirationDate
          ? new Date(data.expirationDate)
          : null;
      }

      if ('image' in data) {
        data.image = data.image ?? null;
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: data,
      });

      return updatedProduct;
    } catch (error: any) {
      if (error.code === 'P2003') {
        const raw = JSON.stringify(error);

        if (
          raw.includes('category_id') ||
          raw.includes('categoryId') ||
          raw.toLowerCase().includes('category')
        ) {
          throw new Error('La categoría proporcionada no existe.');
        }

        if (
          raw.includes('provider_id') ||
          raw.includes('providerId') ||
          raw.toLowerCase().includes('provider')
        ) {
          throw new Error('El proveedor proporcionado no existe.');
        }

        throw new Error('Uno de los valores asociados no es válido.');
      }

      throw error;
    }
  },

  async addStockMovement(params: {
    productId: number;
    adminId: number;
    providerId: number;
    quantity: number;
    type: MovementType;
    date: Date;
    reason?: MovementReason;
  }): Promise<void> {
    try {
      await prisma.inventoryMovement.create({
        data: {
          productId: params.productId,
          adminId: params.adminId,
          movementType: params.type,
          quantity: params.quantity,
          reason: params.reason ?? MovementReason.other,
          createdAt: params.date,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new Error('El administrador no existe o no es válido.');
      }

      throw error;
    }
  },

  async getStockAlerts(dto?: StockAlertDtoType): Promise<ProductEntity[]> {
    const threshold = dto?.threshold ?? 10;
    return prisma.product.findMany({
      where: {
        stock: { lt: threshold },
      },
    });
  },

  async getInventoryMovementReport(
    dto: InventoryReportDtoType
  ): Promise<InventoryMovement[]> {
    const where: any = {};
    if (dto.startDate) where.createdAt = { gte: new Date(dto.startDate) };
    if (dto.endDate)
      where.createdAt = { ...where.createdAt, lte: new Date(dto.endDate) };
    if (dto.productId) where.productId = dto.productId;

    return prisma.inventoryMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  },

  async getProductReport(dto?: ProductReportDtoType): Promise<ProductEntity[]> {
    const where: any = {};

    if (dto?.categoryId) where.categoryId = dto.categoryId;
    if (dto?.providerId) where.providerId = dto.providerId;
    // if (dto?.state) where.state = dto.state;

    return prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  },
};
