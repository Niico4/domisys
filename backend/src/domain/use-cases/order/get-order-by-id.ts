import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';

export interface GetOrderByIdUseCase {
  execute(id: number): Promise<OrderEntity>;
}

export class GetOrderById implements GetOrderByIdUseCase {
  constructor(private readonly repository: OrderRepository) {}

  execute(id: number): Promise<OrderEntity> {
    return this.repository.findById(id);
  }
}
