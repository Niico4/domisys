import { InventoryMovement } from '@/generated/client';
import { MovementReason, MovementType, ProductState } from '@/generated/enums';

import { CreateProductDtoType } from '../dtos/products/create-product.dto';
import { UpdateProductDtoType } from '../dtos/products/update-product.dto';
import { InventoryReportDtoType } from '../dtos/products/inventory/inventory-movement-report.dto';
import { StockAlertDtoType } from '../dtos/products/inventory/stock-alert.dto';
import { ProductReportDtoType } from '../dtos/products/inventory/product-report.dto';

import { ProductEntity } from '../entities/product.entity';

export interface ProductDatasource {
  getAll(): Promise<ProductEntity[]>;
  findById(id: number): Promise<ProductEntity>;

  create(createProductDTO: CreateProductDtoType): Promise<ProductEntity>;
  update(
    id: number,
    updateProductDTO: UpdateProductDtoType
  ): Promise<ProductEntity>;
  delete(id: number): Promise<ProductEntity>;

  addStockMovement(params: {
    productId: number;
    providerId: number;
    adminId: number;
    quantity: number;
    type: MovementType;
    date: Date;
    reason: MovementReason | null;
  }): Promise<void>;
  updateState(id: number, state: ProductState): Promise<ProductEntity>;

  getStockAlerts(dto?: StockAlertDtoType): Promise<ProductEntity[]>;
  getInventoryMovementReport(
    dto: InventoryReportDtoType
  ): Promise<InventoryMovement[]>;
  getInventoryReport(dto?: ProductReportDtoType): Promise<ProductEntity[]>;
}
