import { InventoryMovement } from '@/generated/client';
import { MovementReason, MovementType, ProductState } from '@/generated/enums';

import { CreateProductDtoType } from '../dtos/products/create-product.dto';
import { UpdateProductDtoType } from '../dtos/products/update-product.dto';
import { InventoryMovementsDtoType } from '../dtos/products/inventory/inventory-movements.dto';
import { StockAlertDtoType } from '../dtos/products/inventory/stock-alert.dto';
import { ProductReportDtoType } from '../dtos/products/inventory/product-report.dto';

import { ProductEntity } from '../entities/product.entity';

export interface ProductRepository {
  getAll(): Promise<ProductEntity[]>;
  findById(id: number): Promise<ProductEntity>;
  create(data: CreateProductDtoType): Promise<ProductEntity>;
  update(id: number, data: UpdateProductDtoType): Promise<ProductEntity>;
  delete(id: number): Promise<ProductEntity>;
  updateState(id: number, state: ProductState): Promise<ProductEntity>;

  addStockMovement(params: {
    productId: number;
    providerId: number;
    adminId: number;
    quantity: number;
    type: MovementType;
    date: Date;
    reason: MovementReason;
  }): Promise<void>;

  getStockAlerts(dto?: StockAlertDtoType): Promise<ProductEntity[]>;
  getInventoryMovements(
    dto: InventoryMovementsDtoType
  ): Promise<InventoryMovement[]>;
  getInventoryReport(dto?: ProductReportDtoType): Promise<ProductEntity[]>;
}
