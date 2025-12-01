import { MovementReason, MovementType } from '@/generated/enums';

import { ProductRepository } from '@/domain/repositories/product.repository';
import { ProviderRepository } from '@/domain/repositories/provider.repository';

import { RemoveStockDtoType } from '@/domain/dtos/products/remove-stock.dto';

import { BadRequestException } from '@/shared/exceptions/bad-request';

export interface RemoveStockUseCase {
  execute(productId: number, dto: RemoveStockDtoType): Promise<void>;
}

export class RemoveStock implements RemoveStockUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly providerRepository: ProviderRepository
  ) {}

  async execute(productId: number, dto: RemoveStockDtoType): Promise<void> {
    const { quantity, providerId, reason, adminId } = dto;

    const product = await this.productRepository.findById(productId);
    await this.providerRepository.findById(providerId);

    if (reason === MovementReason.expired) {
      if (!product.expirationDate) {
        throw new BadRequestException(
          'El producto no tiene fecha de expiración.'
        );
      }

      const today = new Date();
      const expiration = new Date(product.expirationDate);

      if (expiration > today) {
        throw new BadRequestException('El producto aún no está vencido.');
      }
    }

    await this.productRepository.addStockMovement({
      productId,
      providerId,
      adminId,
      quantity,
      type: MovementType.out,
      reason: reason as MovementReason,
      date: new Date(),
    });
  }
}
