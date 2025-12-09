import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductRepository } from '@/domain/repositories/product.repository';

import { UpdateProductDtoType } from '@/domain/dtos/products/update-product.dto';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export interface UpdateProductUseCase {
  execute(id: number, dto: UpdateProductDtoType): Promise<ProductEntity>;
}

export class UpdateProduct implements UpdateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: number, dto: UpdateProductDtoType): Promise<ProductEntity> {
    if (dto.expirationDate) {
      const expiration = new Date(dto.expirationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (expiration <= today) {
        throw new BadRequestException(messages.product.expirationMustBeFuture());
      }
    }

    return this.repository.update(id, dto);
  }
}
