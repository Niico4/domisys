import { InventoryMovementsDtoType } from '@/domain/dtos/products/inventory/inventory-movements.dto';
import { ProductRepository } from '@/domain/repositories/product.repository';
import { InventoryMovement } from '@/generated/client';

export interface GetInventoryMovementsUseCase {
  execute(dto: InventoryMovementsDtoType): Promise<InventoryMovement[]>;
}

export class GetInventoryMovements implements GetInventoryMovementsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(dto: InventoryMovementsDtoType): Promise<InventoryMovement[]> {
    return this.repository.getInventoryMovements(dto);
  }
}
