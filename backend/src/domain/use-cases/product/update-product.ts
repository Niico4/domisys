import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductRepository } from '@/domain/repositories/product.repository';

import { UpdateProductDtoType } from '@/domain/dtos/products/update-product.dto';

import { BadRequestException } from '@/shared/exceptions/bad-request';

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
        throw new BadRequestException(
          'La fecha de vencimiento debe ser mayor a la fecha actual.'
        );
      }
    }

    return this.repository.update(id, dto);
  }
}
