import { InventoryMovementReportDtoType } from '@/domain/dtos/products/inventory/inventory-movement-report.dto';
import { ProductRepository } from '@/domain/repositories/product.repository';
import { InventoryMovement } from '@/generated/client';

export interface GetInventoryMovementReportUseCase {
  execute(dto: InventoryMovementReportDtoType): Promise<InventoryMovement[]>;
}

export class GetInventoryMovementReport
  implements GetInventoryMovementReportUseCase
{
  constructor(private readonly repository: ProductRepository) {}

  execute(dto: InventoryMovementReportDtoType): Promise<InventoryMovement[]> {
    return this.repository.getInventoryMovementReport(dto);
  }
}
