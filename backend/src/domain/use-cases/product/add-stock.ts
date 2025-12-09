import { AddStockDtoType } from '@/domain/dtos/products/add-stock.dto';
import { ProductRepository } from '@/domain/repositories/product.repository';
import { ProviderRepository } from '@/domain/repositories/provider.repository';
import { MovementType } from '@/generated/enums';
import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export interface AddStockUseCase {
  execute(
    productId: number,
    dto: AddStockDtoType,
    adminId: number
  ): Promise<void>;
}

export class AddStock implements AddStockUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly providerRepository: ProviderRepository
  ) {}

  async execute(
    productId: number,
    dto: AddStockDtoType,
    adminId: number
  ): Promise<void> {
    const { quantity } = dto;

    const product = await this.productRepository.findById(productId);

    if (!product.providerId) {
      throw new BadRequestException(messages.product.noProviderAssigned());
    }

    await this.providerRepository.findById(product.providerId);

    await this.productRepository.addStockMovement({
      productId,
      providerId: product.providerId,
      quantity,
      type: MovementType.in,
      reason: null,
      date: new Date(),
      adminId,
    });
  }
}
