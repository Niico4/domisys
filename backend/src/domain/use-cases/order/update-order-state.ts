import { OrderState } from '@/generated/enums';

import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export interface UpdateOrderStateUseCase {
  execute(id: number, state: OrderState): Promise<OrderEntity>;
}

const STATE_FLOW: Record<OrderState, OrderState[]> = {
  pending: [OrderState.confirmed, OrderState.cancelled],
  confirmed: [OrderState.shipped, OrderState.cancelled],
  shipped: [OrderState.delivered, OrderState.cancelled],
  delivered: [],
  cancelled: [],
};

export type UpdateOrderStateData = {
  state: OrderState;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
};

export class UpdateOrderState implements UpdateOrderStateUseCase {
  constructor(private readonly repository: OrderRepository) {}

  async execute(id: number, newState: OrderState): Promise<OrderEntity> {
    const order = await this.repository.findById(id);

    if (order.state === newState) {
      throw new BadRequestException(messages.order.alreadyInState(newState));
    }

    const allowedNextStates = STATE_FLOW[order.state];

    if (!allowedNextStates.includes(newState)) {
      throw new BadRequestException(
        messages.order.invalidStateTransition(
          order.state,
          newState,
          allowedNextStates[0] || 'No hay más estados'
        )
      );
    }

    const now = new Date();

    const updateData: UpdateOrderStateData = {
      state: newState,
    };

    switch (newState) {
      case OrderState.confirmed:
        updateData.confirmedAt = now;
        break;
      case OrderState.shipped:
        updateData.shippedAt = now;
        break;
      case OrderState.delivered:
        updateData.deliveredAt = now;
        break;
      case OrderState.cancelled:
        updateData.cancelledAt = now;
        break;
    }

    return this.repository.updateState(id, updateData);
  }
}
