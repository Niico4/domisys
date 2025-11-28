import { StockAlertDtoType } from '@/domain/dtos/products/inventory/stock-alert.dto';
import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductRepository } from '@/domain/repositories/product.repository';

export interface GetStockAlertsUseCase {
  execute(dto?: StockAlertDtoType): Promise<ProductEntity[]>;
}

export class GetStockAlerts implements GetStockAlertsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(dto?: StockAlertDtoType): Promise<ProductEntity[]> {
    return this.repository.getStockAlerts(dto);
  }
}
