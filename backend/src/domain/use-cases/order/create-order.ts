import { CreateOrderDtoType } from '@/domain/dtos/orders/create-order.dto';
import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';

export interface CreateOrderUseCase {
  execute(dto: CreateOrderDtoType): Promise<OrderEntity>;
}

export class CreateOrder implements CreateOrderUseCase {
  constructor(private readonly repository: OrderRepository) {}

  async execute(dto: CreateOrderDtoType): Promise<OrderEntity> {
    return this.repository.createOrder(dto);
  }
}
