import { OrderState } from '@/generated/enums';

import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export interface CancelOrderUseCase {
  execute(id: number, cancellationReason?: string): Promise<OrderEntity>;
}

export class CancelOrder implements CancelOrderUseCase {
  constructor(private readonly repository: OrderRepository) {}

  async execute(id: number, cancellationReason?: string): Promise<OrderEntity> {
    const order = await this.repository.findById(id);

    if (order.state === OrderState.delivered) {
      throw new BadRequestException(messages.order.cannotCancelDelivered());
    }

    if (order.state === OrderState.cancelled) {
      throw new BadRequestException(messages.order.alreadyCanceled());
    }

    return this.repository.cancelOrder(id, cancellationReason);
  }
}
