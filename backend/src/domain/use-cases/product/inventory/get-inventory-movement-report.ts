import { InventoryMovement } from '@/generated/client';

import { InventoryReportDtoType } from '@/domain/dtos/products/inventory/inventory-movement-report.dto';
import { ProductRepository } from '@/domain/repositories/product.repository';

export interface GetInventoryMovementReportUseCase {
  execute(dto: InventoryReportDtoType): Promise<InventoryMovement[]>;
}

export class GetInventoryMovementReport
  implements GetInventoryMovementReportUseCase
{
  constructor(private readonly repository: ProductRepository) {}

  execute(dto: InventoryReportDtoType): Promise<InventoryMovement[]> {
    return this.repository.getInventoryMovementReport(dto);
  }
}
