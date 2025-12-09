import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';

interface GetMyOrdersUseCase {
  execute(customerId: number): Promise<OrderEntity[]>;
}

export class GetMyOrders implements GetMyOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(customerId: number): Promise<OrderEntity[]> {
    return await this.orderRepository.findByCustomer(customerId);
  }
}
