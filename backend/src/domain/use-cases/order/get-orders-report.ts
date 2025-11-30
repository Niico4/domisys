import { OrdersReportDtoType } from '@/domain/dtos/orders/orders-report.dto';
import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';

export interface GetOrdersReportUseCase {
  execute(dto?: OrdersReportDtoType): Promise<OrderEntity[]>;
}

export class GetOrdersReport implements GetOrdersReportUseCase {
  constructor(private readonly repository: OrderRepository) {}

  execute(dto?: OrdersReportDtoType): Promise<OrderEntity[]> {
    return this.repository.getOrdersReport(dto);
  }
}
