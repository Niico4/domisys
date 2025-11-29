import { ProductRepository } from '@/domain/repositories/product.repository';
import { ProviderRepository } from '@/domain/repositories/provider.repository';
import { AddStockDtoType } from '@/domain/dtos/products/add-stock.dto';
import { MovementType } from '@/generated/enums';

export interface AddStockUseCase {
  execute(productId: number, dto: AddStockDtoType): Promise<AddStockDtoType>;
}

export class AddStock implements AddStockUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly providerRepository: ProviderRepository
  ) {}

  async execute(productId: number, dto: AddStockDtoType) {
    const { quantity, providerId, adminId } = dto;

    const product = await this.productRepository.findById(productId);
    if (!product) throw new Error('Producto no encontrado');

    const provider = await this.providerRepository.findById(providerId);
    if (!provider) throw new Error('Proveedor no encontrado');

    if (quantity <= 0) throw new Error('La cantidad debe ser mayor a 0');

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

    return {
      quantity,
      providerId,
      adminId,
      productId,
    };
  }
}
