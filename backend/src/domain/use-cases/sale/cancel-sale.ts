import { SaleState } from '@/generated/enums';

import { SaleEntity } from '@/domain/entities/sale.entity';
import { SaleRepository } from '@/domain/repositories/sale.repository';

import { CancelSaleDtoType } from '@/domain/dtos/sales/cancel-sale.dto';
import { BadRequestException } from '@/shared/exceptions/bad-request';

export interface CancelSaleUseCase {
  execute(id: number, dto: CancelSaleDtoType): Promise<SaleEntity>;
}

export class CancelSale implements CancelSaleUseCase {
  constructor(private readonly repository: SaleRepository) {}

  async execute(id: number, dto: CancelSaleDtoType): Promise<SaleEntity> {
    const sale = await this.repository.findById(id);

    if (sale.state === SaleState.cancel) {
      throw new BadRequestException('La venta ya se encuentra cancelada.');
    }

    return this.repository.cancelSale(id, dto);
  }
}
