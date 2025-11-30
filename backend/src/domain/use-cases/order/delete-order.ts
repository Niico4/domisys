import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';

export interface DeleteOrderUseCase {
  execute(id: number): Promise<OrderEntity>;
}

export class DeleteOrder implements DeleteOrderUseCase {
  constructor(private readonly repository: OrderRepository) {}

  execute(id: number): Promise<OrderEntity> {
    return this.repository.deleteOrder(id);
  }
}
