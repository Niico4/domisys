import { OrderState } from '@/generated/enums';

import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';

import { CancelOrderDtoType } from '@/domain/dtos/orders/cancel-order.dto';
import { BadRequestException } from '@/shared/exceptions/bad-request';

export interface CancelOrderUseCase {
  execute(id: number, dto: CancelOrderDtoType): Promise<OrderEntity>;
}

export class CancelOrder implements CancelOrderUseCase {
  constructor(private readonly repository: OrderRepository) {}

  async execute(id: number, dto: CancelOrderDtoType): Promise<OrderEntity> {
    const order = await this.repository.findById(id);

    if (order.state === OrderState.cancel) {
      throw new BadRequestException('El pedido ya se encuentra cancelado.');
    }

    return this.repository.cancelOrder(id, dto);
  }
}
