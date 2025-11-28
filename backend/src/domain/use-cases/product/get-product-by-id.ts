import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductRepository } from '@/domain/repositories/product.repository';

export interface GetProductByIdUseCase {
  execute(id: number): Promise<ProductEntity>;
}

export class GetProductById implements GetProductByIdUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: number): Promise<ProductEntity> {
    return this.repository.findById(id);
  }
}
