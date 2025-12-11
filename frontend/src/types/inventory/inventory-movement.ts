import { MovementType, MovementReason } from './enums/movement-inventory';

export interface InventoryMovement {
  id: number;
  movementType: MovementType;
  reason: MovementReason | null;
  quantity: number | null;
  createdAt: string;
  productId: number;
  adminId: number;
  product?: {
    id: number;
    name: string;
    measure: string;
  };
  admin?: {
    id: number;
    username: string;
    name: string;
  };
}

export interface InventoryMovementFilters {
  startDate?: string;
  endDate?: string;
  productId?: number;
}
