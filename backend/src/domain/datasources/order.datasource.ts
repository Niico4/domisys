import { CancelOrderDtoType } from '../dtos/orders/cancel-order.dto';
import { CreateOrderDtoType } from '../dtos/orders/create-order.dto';
import { OrdersReportDtoType } from '../dtos/orders/orders-report.dto';
import { OrderEntity } from '../entities/order.entity';
import { OrderState } from '@/generated/enums';

export interface OrderDatasource {
  getAll(): Promise<OrderEntity[]>;
  findById(id: number): Promise<OrderEntity>;
  createOrder(data: CreateOrderDtoType): Promise<OrderEntity>;
  updateState(id: number, state: OrderState): Promise<OrderEntity>;
  cancelOrder(id: number, dto: CancelOrderDtoType): Promise<OrderEntity>;
  deleteOrder(id: number): Promise<OrderEntity>;
  getOrdersReport(dto?: OrdersReportDtoType): Promise<OrderEntity[]>;
}
