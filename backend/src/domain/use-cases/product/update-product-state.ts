import { ProductState } from '@/generated/enums';

import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductRepository } from '@/domain/repositories/product.repository';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export interface UpdateProductStateUseCase {
  execute(productId: number, state: ProductState): Promise<ProductEntity>;
}

export class UpdateProductState implements UpdateProductStateUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number, state: ProductState): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);

    if (product.state === state) {
      throw new BadRequestException(messages.product.alreadyInState(state));
    }

    return this.productRepository.updateState(id, state);
  }
}
