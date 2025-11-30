import { Prisma } from '@/generated/client';
import { prisma } from '@/data/postgresql';
import { OrderState } from '@/generated/enums';

import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderDatasource } from '@/domain/datasources/order.datasource';

import { CancelOrderDtoType } from '@/domain/dtos/orders/cancel-order.dto';
import { CreateOrderDtoType } from '@/domain/dtos/orders/create-order.dto';
import { OrdersReportDtoType } from '@/domain/dtos/orders/orders-report.dto';

import { UserRoleService } from '@/infrastructure/services/user-role.service';
import { BadRequestException } from '@/shared/exceptions/bad-request';

const userRoleService = new UserRoleService(prisma);

export const orderDatasourceImplementation: OrderDatasource = {
  async getAll(): Promise<OrderEntity[]> {
    return await prisma.order.findMany({
      include: { orderProducts: true },
    });
  },

  async findById(id: number): Promise<OrderEntity> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderProducts: true },
    });

    if (!order) throw new BadRequestException('No se encontró el pedido.');

    return order;
  },

  async createOrder(data: CreateOrderDtoType): Promise<OrderEntity> {
    const { products, customerId, deliveryId, ...orderData } = data;

    await userRoleService.validateUserRole(customerId, 'customer');
    await userRoleService.validateUserRole(deliveryId, 'delivery');

    const productIds = products.map((p) => p.productId);
    const existing = await prisma.product.findMany({
      where: { id: { in: productIds }, state: 'active' },
      select: { id: true },
    });

    if (existing.length !== products.length) {
      throw new BadRequestException(
        'Hay productos inválidos o inactivos en el pedido.'
      );
    }

    return await prisma.order.create({
      data: {
        ...orderData,
        deliveryId,
        customerId,
        orderProducts: {
          create: products.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            unitPrice: p.unitPrice,
          })),
        },
      },
      include: { orderProducts: true },
    });
  },

  async updateState(id: number, state: OrderState): Promise<OrderEntity> {
    await this.findById(id);

    return await prisma.order.update({
      where: { id },
      data: { state },
    });
  },

  async cancelOrder(id: number, dto: CancelOrderDtoType): Promise<OrderEntity> {
    await this.findById(id);
    const { customerId, deliveryId, ...data } = dto;

    await userRoleService.validateUserRole(customerId, 'customer');
    await userRoleService.validateUserRole(deliveryId, 'delivery');

    return await prisma.order.update({
      where: { id },
      data: { ...data, state: OrderState.cancel },
    });
  },

  async deleteOrder(id: number): Promise<OrderEntity> {
    await this.findById(id);

    return await prisma.order.delete({
      where: { id },
    });
  },

  async getOrdersReport(dto?: OrdersReportDtoType): Promise<OrderEntity[]> {
    const where: Prisma.OrderWhereInput = {};

    if (dto?.customerId) where.customerId = dto.customerId;
    if (dto?.deliveryId) where.deliveryId = dto.deliveryId;
    if (dto?.state) where.state = dto.state; // TODO: Fix filtrado por estado

    if (dto?.startDate || dto?.endDate) {
      where.createdAt = {};

      if (dto.startDate) {
        const start = new Date(dto.startDate);
        start.setUTCHours(0, 0, 0, 0);
        where.createdAt.gte = start;
      }
      if (dto.endDate) {
        const end = new Date(dto.endDate);
        end.setUTCHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    return await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: { orderProducts: true },
    });
  },
};
