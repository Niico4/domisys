import { MovementReason, MovementType } from '@/generated/enums';

import { ProductRepository } from '@/domain/repositories/product.repository';

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
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    productId: number,
    dto: RemoveStockDtoType,
    adminId: number
  ): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (dto.reason === MovementReason.expired) {
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
      adminId,
      providerId: dto.providerId,
      quantity: dto.quantity,
      type: MovementType.out,
      reason: dto.reason,
      date: new Date(),
    });
  }
}
