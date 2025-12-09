import { OrderState } from '@/generated/enums';

import { OrderDatasource } from '@/domain/datasources/order.datasource';
import { OrderRepository } from '@/domain/repositories/order.repository';

import { OrdersReportDtoType } from '@/domain/dtos/orders/orders-report.dto';

export const orderRepositoryImplementation = (
  datasource: OrderDatasource
): OrderRepository => ({
  getAll: () => datasource.getAll(),
  findById: (id: number) => datasource.findById(id),
  findByDelivery: (deliveryId: number) => datasource.findByDelivery(deliveryId),
  findByCustomer: (customerId: number) => datasource.findByCustomer(customerId),
  createOrder: (data) => datasource.createOrder(data),
  updateState: (id: number, newState: OrderState) =>
    datasource.updateState(id, newState),
  cancelOrder: (id: number) => datasource.cancelOrder(id),
  deleteOrder: (id: number) => datasource.deleteOrder(id),

  getOrdersReport: (dto: OrdersReportDtoType) =>
    datasource.getOrdersReport(dto),
});
