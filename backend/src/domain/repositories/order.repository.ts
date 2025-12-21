import { OrderEntity } from '../entities/order.entity';

import { CreateOrderDtoType } from '../dtos/orders/create-order.dto';
import { OrdersReportDtoType } from '../dtos/orders/orders-report.dto';
import { UpdateOrderStateData } from '../use-cases/order/update-order-state';

export interface OrderRepository {
  getAll(): Promise<OrderEntity[]>;
  findById(id: number): Promise<OrderEntity>;
  findByDelivery(deliveryId: number): Promise<OrderEntity[]>;
  findByCustomer(customerId: number): Promise<OrderEntity[]>;

  createOrder(data: CreateOrderDtoType): Promise<OrderEntity>;
  updateState(id: number, state: UpdateOrderStateData): Promise<OrderEntity>;
  cancelOrder(id: number): Promise<OrderEntity>;
  completeOrder(id: number): Promise<OrderEntity>;

  deleteOrder(id: number): Promise<OrderEntity>;

  getOrdersReport(dto?: OrdersReportDtoType): Promise<OrderEntity[]>;
}
