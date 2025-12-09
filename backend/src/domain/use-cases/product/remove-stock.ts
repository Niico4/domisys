import { MovementReason, MovementType } from '@/generated/enums';

import { ProductRepository } from '@/domain/repositories/product.repository';
import { ProviderRepository } from '@/domain/repositories/provider.repository';

import { RemoveStockDtoType } from '@/domain/dtos/products/remove-stock.dto';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export interface RemoveStockUseCase {
  execute(
    productId: number,
    dto: RemoveStockDtoType,
    adminId: number
  ): Promise<void>;
}

export class RemoveStock implements RemoveStockUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly providerRepository: ProviderRepository
  ) {}

  async execute(
    productId: number,
    dto: RemoveStockDtoType,
    adminId: number
  ): Promise<void> {
    const { quantity, reason } = dto;

    const product = await this.productRepository.findById(productId);

    if (!product.providerId) {
      throw new BadRequestException(messages.product.noProviderAssigned());
    }

    await this.providerRepository.findById(product.providerId);

    if (reason === MovementReason.expired) {
      if (!product.expirationDate) {
        throw new BadRequestException(messages.product.noExpirationDate());
      }

      const today = new Date();
      const expiration = new Date(product.expirationDate);

      if (expiration > today) {
        throw new BadRequestException(messages.product.notExpiredYet());
      }
    }

    await this.productRepository.addStockMovement({
      productId,
      providerId: product.providerId,
      adminId,
      quantity,
      type: MovementType.out,
      reason: reason as MovementReason,
      date: new Date(),
    });
  }
}
