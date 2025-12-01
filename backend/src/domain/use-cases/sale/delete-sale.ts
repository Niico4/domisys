import { SaleEntity } from '@/domain/entities/sale.entity';
import { SaleRepository } from '@/domain/repositories/sale.repository';

export interface DeleteSaleUseCase {
  execute(id: number): Promise<SaleEntity>;
}

export class DeleteSale implements DeleteSaleUseCase {
  constructor(private readonly repository: SaleRepository) {}

  execute(id: number): Promise<SaleEntity> {
    return this.repository.deleteSale(id);
  }
}
