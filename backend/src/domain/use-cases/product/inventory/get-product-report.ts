import { ProductReportDtoType } from '@/domain/dtos/products/inventory/product-report.dto';
import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductRepository } from '@/domain/repositories/product.repository';

export interface GetInventoryReportUseCase {
  execute(dto?: ProductReportDtoType): Promise<ProductEntity[]>;
}

export class GetInventoryReport implements GetInventoryReportUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(dto?: ProductReportDtoType): Promise<ProductEntity[]> {
    return this.repository.getInventoryReport(dto);
  }
}
