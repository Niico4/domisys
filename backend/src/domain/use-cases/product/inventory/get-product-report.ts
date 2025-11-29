import { ProductRepository } from '@/domain/repositories/product.repository';
import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductReportDtoType } from '@/domain/dtos/products/inventory/product-report.dto';

export interface InventoryReportUseCase {
  execute(dto?: ProductReportDtoType): Promise<ProductEntity[]>;
}

export class GetInventoryReport implements InventoryReportUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(dto?: ProductReportDtoType): Promise<ProductEntity[]> {
    return this.repository.getInventoryReport(dto);
  }
}
