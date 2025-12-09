import { OrderState } from '@/generated/enums';

import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export interface UpdateOrderStateUseCase {
  execute(id: number, state: OrderState): Promise<OrderEntity>;
}

export class UpdateOrderState implements UpdateOrderStateUseCase {
  private readonly stateOrder: OrderState[] = [
    'pending',
    'confirmed',
    'shipped',
    'delivered',
  ];

  constructor(private readonly repository: OrderRepository) {}

  async execute(id: number, newState: OrderState): Promise<OrderEntity> {
    const order = await this.repository.findById(id);

    if (order.state === newState) {
      throw new BadRequestException(messages.order.alreadyInState(newState));
    }

    if (newState === OrderState.cancel) {
      if (order.state === OrderState.cancel) {
        throw new BadRequestException(messages.order.alreadyCanceled());
      }
      if (order.state === OrderState.delivered) {
        throw new BadRequestException(messages.order.cannotCancelDelivered());
      }
      return this.repository.updateState(id, newState);
    }

    if (order.state === OrderState.cancel) {
      throw new BadRequestException(messages.order.cannotModifyCanceled());
    }

    if (order.state === OrderState.delivered) {
      throw new BadRequestException(messages.order.cannotModifyDelivered());
    }

    const currentIndex = this.stateOrder.indexOf(order.state);
    const newIndex = this.stateOrder.indexOf(newState);

    // avanza exactamente 1 posición
    if (newIndex !== currentIndex + 1) {
      const nextState =
        this.stateOrder[currentIndex + 1] || OrderState.delivered;
      throw new BadRequestException(
        messages.order.invalidStateTransition(order.state, newState, nextState)
      );
    }

    return this.repository.updateState(id, newState);
  }
}
