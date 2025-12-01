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
        `El pedido ya tiene el estado '${newState}'.`
      );
    }

    // cancelar desde cualquier estado (excepto si ya está cancelado/entregado)
    if (newState === OrderState.cancel) {
      if (order.state === OrderState.cancel) {
        throw new BadRequestException('El pedido ya está cancelado.');
      }
      if (order.state === OrderState.delivered) {
        throw new BadRequestException(
          'No se puede cancelar un pedido ya entregado.'
        );
      }
      return this.repository.updateState(id, newState);
    }

    if (order.state === OrderState.cancel) {
      throw new BadRequestException(
        'No se puede modificar un pedido cancelado.'
      );
    }

    if (order.state === OrderState.delivered) {
      throw new BadRequestException(
        'No se puede modificar un pedido ya entregado.'
      );
    }

    const currentIndex = this.stateOrder.indexOf(order.state);
    const newIndex = this.stateOrder.indexOf(newState);

    // avanza exactamente 1 posición
    if (newIndex !== currentIndex + 1) {
      const nextState = this.stateOrder[currentIndex + 1];
      throw new BadRequestException(
        `No se puede cambiar de '${order.state}' a '${newState}'. El siguiente estado debe ser '${nextState}'.`
      );
    }

    return this.repository.updateState(id, newState);
  }
}
