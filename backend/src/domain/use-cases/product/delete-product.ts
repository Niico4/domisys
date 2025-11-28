import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductRepository } from '@/domain/repositories/product.repository';

export interface DeleteProductUseCase {
  execute(id: number): Promise<ProductEntity>;
}

export class DeleteProduct implements DeleteProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: number): Promise<ProductEntity> {
    return this.repository.delete(id);
  }
}
