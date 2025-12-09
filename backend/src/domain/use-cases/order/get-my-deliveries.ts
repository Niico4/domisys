import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';

export interface GetMyDeliveriesUseCase {
  execute(deliveryId: number): Promise<OrderEntity[]>;
}

export class GetMyDeliveries implements GetMyDeliveriesUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(deliveryId: number): Promise<OrderEntity[]> {
    return await this.orderRepository.findByDelivery(deliveryId);
  }
}
