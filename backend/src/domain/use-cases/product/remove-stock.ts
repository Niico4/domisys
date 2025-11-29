import { ProductRepository } from '@/domain/repositories/product.repository';
import { ProviderRepository } from '@/domain/repositories/provider.repository';
import { RemoveStockDtoType } from '@/domain/dtos/products/remove-stock.dto';
import { MovementType, MovementReason } from '@/generated/enums';

export interface RemoveStockUseCase {
  execute(
    productId: number,
    dto: RemoveStockDtoType
  ): Promise<RemoveStockDtoType>;
}

export class RemoveStock implements RemoveStockUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly providerRepository: ProviderRepository
  ) {}

  async execute(productId: number, dto: RemoveStockDtoType) {
    const { quantity, providerId, reason, adminId } = dto;

    const product = await this.productRepository.findById(productId);
    if (!product) throw new Error('Producto no encontrado');

    const provider = await this.providerRepository.findById(providerId);
    if (!provider) throw new Error('Proveedor no encontrado');

    if (quantity <= 0) throw new Error('La cantidad debe ser mayor a 0');

    if (quantity > product.stock)
      throw new Error('No hay suficiente stock para realizar la salida');

    if (reason === MovementReason.expired) {
      if (!product.expirationDate)
        throw new Error('El producto no tiene fecha de expiración');

      const today = new Date();
      const expiration = new Date(product.expirationDate);

      if (expiration > today)
        throw new Error('El producto aún no está vencido');
    }

    await this.productRepository.update(productId, {
      stock: product.stock - quantity,
    });

    await this.productRepository.addStockMovement({
      productId,
      providerId,
      adminId,
      quantity,
      type: MovementType.out,
      reason: reason as MovementReason,
      date: new Date(),
    });

    return {
      productId,
      quantity,
      providerId,
      adminId,
      reason,
    };
  }
}
