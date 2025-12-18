import { AddStockDtoType } from '@/domain/dtos/products/add-stock.dto';
import { ProductRepository } from '@/domain/repositories/product.repository';
import { MovementType } from '@/generated/enums';

export interface AddStockUseCase {
  execute(
    productId: number,
    dto: AddStockDtoType,
    adminId: number
  ): Promise<void>;
}

export class AddStock implements AddStockUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    productId: number,
    dto: AddStockDtoType,
    adminId: number
  ): Promise<void> {
    await this.productRepository.findById(productId);

    await this.productRepository.addStockMovement({
      productId,
      providerId: dto.providerId,
      quantity: dto.quantity,
      type: MovementType.in,
      reason: dto.reason,
      date: new Date(),
      adminId,
    });
  }
}
