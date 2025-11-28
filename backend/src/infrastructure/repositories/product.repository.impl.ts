import { ProductDatasource } from '@/domain/datasources/product.datasource';
import { CreateProductDtoType } from '@/domain/dtos/products/create-product.dto';
import { InventoryReportDtoType } from '@/domain/dtos/products/inventory/inventory-movement-report.dto';
import { ProductReportDtoType } from '@/domain/dtos/products/inventory/product-report.dto';
import { StockAlertDtoType } from '@/domain/dtos/products/inventory/stock-alert.dto';
import { UpdateProductDtoType } from '@/domain/dtos/products/update-product.dto';
import { ProductRepository } from '@/domain/repositories/product.repository';
import { MovementReason, MovementType } from '@/generated/enums';

export const productRepositoryImplementation = (
  datasource: ProductDatasource
): ProductRepository => ({
  getAll: () => datasource.getAll(),
  findById: (id: number) => datasource.findById(id),

  create: (data: CreateProductDtoType) => datasource.create(data),
  update: (id: number, data: UpdateProductDtoType) =>
    datasource.update(id, data),
  delete: (id: number) => datasource.delete(id),

  addStockMovement: (params: {
    productId: number;
    providerId: number;
    adminId: number;
    quantity: number;
    type: MovementType;
    date: Date;
    reason?: MovementReason;
  }) => datasource.addStockMovement(params),

  getStockAlerts: (data?: StockAlertDtoType) => datasource.getStockAlerts(data),
  getInventoryMovementReport: (data: InventoryReportDtoType) =>
    datasource.getInventoryMovementReport(data),

  getProductReport: (dto: ProductReportDtoType) =>
    datasource.getProductReport(dto),
});
