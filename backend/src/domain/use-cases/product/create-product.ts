import { CreateProductDtoType } from '@/domain/dtos/products/create-product.dto';
import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductRepository } from '@/domain/repositories/product.repository';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export interface CreateProductUseCase {
  execute(dto: CreateProductDtoType): Promise<ProductEntity>;
}

export class CreateProduct implements CreateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(dto: CreateProductDtoType): Promise<ProductEntity> {
    if (dto.expirationDate) {
      const expiration = new Date(dto.expirationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (expiration <= today) {
        throw new BadRequestException(
          messages.product.expirationMustBeFuture()
        );
      }
    }

    return this.repository.create(dto);
  }
}
