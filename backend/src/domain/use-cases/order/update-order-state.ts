import { OrderState } from '@/generated/enums';

import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';
import { BadRequestException } from '@/shared/exceptions/bad-request';

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
      throw new BadRequestException(
        `La orden ya tiene el estado '${newState}'.`
      );
    }

    if (newState === 'cancel') {
      if (order.state === 'delivered') {
        throw new BadRequestException(
          'No se puede cancelar una orden ya entregada.'
        );
      }
      return this.repository.updateState(id, newState);
    }

    if (order.state === 'cancel') {
      throw new BadRequestException(
        'No se puede modificar una orden cancelada.'
      );
    }

    if (order.state === 'delivered') {
      throw new BadRequestException(
        'No se puede modificar una orden ya entregada.'
      );
    }

    const currentIndex = this.stateOrder.indexOf(order.state);
    const newIndex = this.stateOrder.indexOf(newState);

    if (newIndex <= currentIndex) {
      throw new BadRequestException(
        `No se puede retroceder el estado de '${order.state}' a '${newState}'. Solo se permite avanzar linealmente.`
      );
    }

    return this.repository.updateState(id, newState);
  }
}
