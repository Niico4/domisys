import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';

export interface GetAllOrdersUseCase {
  execute(): Promise<OrderEntity[]>;
}

export class GetAllOrders implements GetAllOrdersUseCase {
  constructor(private readonly repository: OrderRepository) {}

  execute(): Promise<OrderEntity[]> {
    return this.repository.getAll();
  }
}
