import { SaleEntity } from '@/domain/entities/sale.entity';
import { SaleRepository } from '@/domain/repositories/sale.repository';

export interface GetAllSalesUseCase {
  execute(): Promise<SaleEntity[]>;
}

export class GetAllSales implements GetAllSalesUseCase {
  constructor(private readonly repository: SaleRepository) {}

  execute(): Promise<SaleEntity[]> {
    return this.repository.getAll();
  }
}
