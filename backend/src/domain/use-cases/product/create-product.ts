import { CreateProductDtoType } from '@/domain/dtos/products/create-product.dto';
import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductRepository } from '@/domain/repositories/product.repository';

export interface CreateProductUseCase {
  execute(dto: CreateProductDtoType): Promise<ProductEntity>;
}

export class CreateProduct implements CreateProductUseCase {
  constructor(public readonly repository: ProductRepository) {}

  async execute(dto: CreateProductDtoType): Promise<ProductEntity> {
    if (dto.expirationDate) {
      const expiration = new Date(dto.expirationDate);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (expiration <= today) {
        throw new Error(
          'La fecha de vencimiento no puede ser menor a la fecha actual'
        );
      }
    }

    return this.repository.create(dto);
  }
}
