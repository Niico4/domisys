import { CreateSaleDtoType } from '@/domain/dtos/sales/create-sale.dto';
import { SaleEntity } from '@/domain/entities/sale.entity';
import { SaleRepository } from '@/domain/repositories/sale.repository';

export interface CreateSaleUseCase {
  execute(dto: CreateSaleDtoType): Promise<SaleEntity>;
}

export class CreateSale implements CreateSaleUseCase {
  constructor(private readonly repository: SaleRepository) {}

  execute(dto: CreateSaleDtoType): Promise<SaleEntity> {
    return this.repository.createSale(dto);
  }
}
