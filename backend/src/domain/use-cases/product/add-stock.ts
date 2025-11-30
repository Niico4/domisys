import { AddStockDtoType } from '@/domain/dtos/products/add-stock.dto';
import { ProductRepository } from '@/domain/repositories/product.repository';
import { ProviderRepository } from '@/domain/repositories/provider.repository';
import { MovementType } from '@/generated/enums';

export interface AddStockUseCase {
  execute(productId: number, dto: AddStockDtoType): Promise<void>;
}

export class AddStock implements AddStockUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly providerRepository: ProviderRepository
  ) {}

  async execute(productId: number, dto: AddStockDtoType): Promise<void> {
    const { quantity, providerId, adminId } = dto;

    const product = await this.productRepository.findById(productId);
    await this.providerRepository.findById(providerId);

    await this.productRepository.update(productId, {
      stock: product.stock + quantity,
    });

    await this.productRepository.addStockMovement({
      productId,
      providerId,
      quantity,
      type: MovementType.in,
      reason: null,
      date: new Date(),
      adminId,
    });
  }
}
