import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductRepository } from '@/domain/repositories/product.repository';

export interface GetAllProductsUseCase {
  execute(): Promise<ProductEntity[]>;
}

export class GetAllProducts implements GetAllProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(): Promise<ProductEntity[]> {
    return this.repository.getAll();
  }
}
