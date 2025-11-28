import { ProductRepository } from '@/domain/repositories/product.repository';
import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductReportDtoType } from '@/domain/dtos/products/inventory/product-report.dto';

export interface ProductReportUseCase {
  execute(dto?: ProductReportDtoType): Promise<ProductEntity[]>;
}

export class GetProductReport implements ProductReportUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(dto?: ProductReportDtoType): Promise<ProductEntity[]> {
    return this.repository.getProductReport(dto);
  }
}
