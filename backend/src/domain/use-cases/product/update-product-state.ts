import { ProductRepository } from '@/domain/repositories/product.repository';
import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductState } from '@/generated/enums';

export interface UpdateProductStateUseCase {
  execute(productId: number, state: ProductState): Promise<ProductEntity>;
}

export class UpdateProductState implements UpdateProductStateUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number, state: ProductState): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`No se encontró el producto ${id}`);
    }

    if (product.state === state) {
      throw new Error(
        `El producto ya tiene el estado '${state}', no se puede actualizar al mismo valor`
      );
    }

    return this.productRepository.updateState(id, state);
  }
}
