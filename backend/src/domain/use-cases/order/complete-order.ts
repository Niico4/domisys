import { OrderState } from '@/generated/enums';

import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export interface CompleteOrderUseCase {
  execute(id: number): Promise<OrderEntity>;
}

export class CompleteOrder implements CompleteOrderUseCase {
  constructor(private readonly repository: OrderRepository) {}

  async execute(id: number): Promise<OrderEntity> {
    const order = await this.repository.findById(id);

    if (order.state === OrderState.delivered) {
      throw new BadRequestException(messages.order.alreadyDelivered());
    }

    if (order.state !== OrderState.shipped) {
      throw new BadRequestException(messages.order.mustBeShipped());
    }

    return this.repository.completeOrder(id);
  }
}
