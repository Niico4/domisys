import { SaleEntity } from '@/domain/entities/sale.entity';
import { SaleRepository } from '@/domain/repositories/sale.repository';

export interface GetSaleByIdUseCase {
  execute(id: number): Promise<SaleEntity>;
}

export class GetSaleById implements GetSaleByIdUseCase {
  constructor(private readonly repository: SaleRepository) {}

  execute(id: number): Promise<SaleEntity> {
    return this.repository.findById(id);
  }
}
