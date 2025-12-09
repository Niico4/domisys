import { Prisma } from '@/generated/client';
import { prisma } from '@/data/postgresql';
import {
  MovementReason,
  MovementType,
  OrderState,
  ProductState,
  UserRole,
} from '@/generated/enums';

import { OrderEntity } from '@/domain/entities/order.entity';
import { OrderDatasource } from '@/domain/datasources/order.datasource';

import { CreateOrderDtoType } from '@/domain/dtos/orders/create-order.dto';
import { OrdersReportDtoType } from '@/domain/dtos/orders/orders-report.dto';

import { UserRoleService } from '@/infrastructure/services/user-role.service';
import { DeliveryAssignmentService } from '@/shared/services/delivery-assignment.service';
import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

const userRoleService = new UserRoleService(prisma);
const deliveryAssignmentService = new DeliveryAssignmentService();

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

    if (!order) throw new BadRequestException(messages.order.notFound());

    return order;
  },

  async createOrder(data: CreateOrderDtoType): Promise<OrderEntity> {
    const { products, customerId, ...orderData } = data;

    await userRoleService.validateUserRole(customerId, UserRole.customer);

    // Validar que la dirección pertenezca al customer
    const address = await prisma.address.findUnique({
      where: { id: orderData.addressId },
    });

    if (!address) {
      throw new BadRequestException(messages.address.notFound());
    }

    if (address.userId !== customerId) {
      throw new BadRequestException(messages.address.doesNotBelongToUser());
    }

    const assignedDeliveryId = await deliveryAssignmentService.assignDelivery();

    const productIds = products.map((p) => p.productId);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, state: ProductState.active },
      select: { id: true, name: true, stock: true, price: true },
    });

    if (existingProducts.length !== products.length) {
      throw new BadRequestException(messages.product.invalidOrInactive());
    }

    // validar stock para cada producto
    for (const orderProduct of products) {
      const product = existingProducts.find(
        (p) => p.id === orderProduct.productId
      );

      if (!product) {
        throw new BadRequestException(
          messages.product.notFoundWithId(orderProduct.productId)
        );
      }

      if (product.stock < orderProduct.quantity) {
        throw new BadRequestException(
          messages.product.insufficientStock(
            product.name,
            product.stock,
            orderProduct.quantity
          )
        );
      }
    }

    return await prisma.$transaction(async (tx) => {
      let totalAmount: number = 0;

      for (const orderProduct of products) {
        await tx.product.update({
          where: { id: orderProduct.productId },
          data: {
            stock: {
              decrement: orderProduct.quantity,
            },
          },
        });

        const product = existingProducts.find(
          (p) => p.id === orderProduct.productId
        );
        totalAmount += Number(product!.price) * orderProduct.quantity;

        await tx.inventoryMovement.create({
          data: {
            productId: orderProduct.productId,
            quantity: orderProduct.quantity,
            movementType: MovementType.out,
            reason: MovementReason.sale,
            adminId: assignedDeliveryId,
            createdAt: new Date(),
          },
        });
      }

      const newOrder = await tx.order.create({
        data: {
          ...orderData,
          totalAmount,
          state: OrderState.pending,
          deliveryId: assignedDeliveryId,
          customerId,
          orderProducts: {
            create: products.map((p) => {
              const product = existingProducts.find(
                (prod) => prod.id === p.productId
              );
              return {
                productId: p.productId,
                quantity: p.quantity,
                unitPrice: product!.price,
              };
            }),
          },
        },
        include: { orderProducts: true },
      });

      return newOrder;
    });
  },

  async updateState(id: number, state: OrderState): Promise<OrderEntity> {
    await this.findById(id);

    return await prisma.order.update({
      where: { id },
      data: { state },
    });
  },

  async cancelOrder(id: number): Promise<OrderEntity> {
    return await prisma.$transaction(async (tx) => {
      const orderWithProducts = await tx.order.findUnique({
        where: { id },
        include: { orderProducts: true },
      });

      if (!orderWithProducts) {
        throw new BadRequestException(messages.order.notFound());
      }

      for (const orderProduct of orderWithProducts.orderProducts) {
        await tx.product.update({
          where: { id: orderProduct.productId },
          data: {
            stock: {
              increment: orderProduct.quantity,
            },
          },
        });

        // entrada por devolución
        await tx.inventoryMovement.create({
          data: {
            productId: orderProduct.productId,
            quantity: orderProduct.quantity,
            movementType: MovementType.in,
            reason: MovementReason.return,
            adminId:
              orderWithProducts.deliveryId || orderWithProducts.customerId || 0,
            createdAt: new Date(),
          },
        });
      }

      const canceledOrder = await tx.order.update({
        where: { id },
        data: { state: OrderState.cancel },
        include: { orderProducts: true },
      });

      return canceledOrder;
    });
  },

  async deleteOrder(id: number): Promise<OrderEntity> {
    await this.findById(id);

    return await prisma.order.delete({
      where: { id },
    });
  },

  async findByDelivery(deliveryId: number): Promise<OrderEntity[]> {
    return await prisma.order.findMany({
      where: { deliveryId },
      include: { orderProducts: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findByCustomer(customerId: number): Promise<OrderEntity[]> {
    return await prisma.order.findMany({
      where: { customerId },
      include: { orderProducts: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getOrdersReport(dto?: OrdersReportDtoType): Promise<OrderEntity[]> {
    const where: Prisma.OrderWhereInput = {};

    if (dto?.customerId) where.customerId = dto.customerId;
    if (dto?.deliveryId) where.deliveryId = dto.deliveryId;
    if (dto?.state) where.state = dto.state;

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
      orderBy: { createdAt: 'desc' },
      include: { orderProducts: true },
    });
  },
};
