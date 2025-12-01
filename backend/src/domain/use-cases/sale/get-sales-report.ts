import { SaleRepository } from '@/domain/repositories/sale.repository';
import { SaleEntity } from '@/domain/entities/sale.entity';

import { SalesReportDtoType } from '@/domain/dtos/sales/sales-report.dto';

export interface GetSalesReportUseCase {
  execute(dto?: SalesReportDtoType): Promise<SaleEntity[]>;
}

export class GetSalesReport implements GetSalesReportUseCase {
  constructor(private readonly repository: SaleRepository) {}

  execute(dto?: SalesReportDtoType): Promise<SaleEntity[]> {
    return this.repository.getSalesReport(dto);
  }
}
