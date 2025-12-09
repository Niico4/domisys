import { SaleState } from '@/generated/enums';

import { SaleEntity } from '@/domain/entities/sale.entity';
import { SaleRepository } from '@/domain/repositories/sale.repository';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export interface CancelSaleUseCase {
  execute(id: number, cashierId: number): Promise<SaleEntity>;
}

export class CancelSale implements CancelSaleUseCase {
  constructor(private readonly repository: SaleRepository) {}

  async execute(id: number, cashierId: number): Promise<SaleEntity> {
    const sale = await this.repository.findById(id);

    if (sale.state === SaleState.cancel) {
      throw new BadRequestException(messages.sale.alreadyCanceled());
    }

    return this.repository.cancelSale(id, cashierId);
  }
}
