import { InventoryMovement } from '@/generated/client';

import { InventoryReportDtoType } from '@/domain/dtos/products/inventory/inventory-movement-report.dto';
import { ProductRepository } from '@/domain/repositories/product.repository';

export interface GetInventoryReportUseCase {
  execute(dto: InventoryReportDtoType): Promise<InventoryMovement[]>;
}

export class GetInventoryReport implements GetInventoryReportUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(dto: InventoryReportDtoType): Promise<InventoryMovement[]> {
    return this.repository.getInventoryMovementReport(dto);
  }
}
