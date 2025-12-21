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
import { UpdateOrderStateData } from '@/domain/use-cases/order/update-order-state';

const productSelectBasic = {
  id: true,
  name: true,
  price: true,
} as const;

const userSelectBasic = {
  id: true,
  name: true,
  lastName: true,
  username: true,
  phoneNumber: true,
} as const;

const userRoleService = new UserRoleService(prisma);
const deliveryAssignmentService = new DeliveryAssignmentService();

export const orderDatasourceImplementation: OrderDatasource = {
  async getAll(): Promise<OrderEntity[]> {
    return await prisma.order.findMany({
      include: {
        orderProducts: {
          include: { product: { select: productSelectBasic } },
        },
        customer: { select: userSelectBasic },
        delivery: { select: userSelectBasic },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: number): Promise<OrderEntity> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderProducts: {
          include: { product: { select: productSelectBasic } },
        },
        customer: { select: userSelectBasic },
        delivery: { select: userSelectBasic },
      },
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

    const productMap = new Map(existingProducts.map((p) => [p.id, p]));

    for (const orderProduct of products) {
      const product = productMap.get(orderProduct.productId)!;

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
      let totalAmount = 0;
      const currentDate = new Date();

      const orderProductsData = products.map((p) => {
        const product = productMap.get(p.productId)!;
        totalAmount += Number(product.price) * p.quantity;

        return {
          productId: p.productId,
          quantity: p.quantity,
          price: product.price,
        };
      });

      await Promise.all(
        products.map((p) =>
          tx.product.update({
            where: { id: p.productId },
            data: { stock: { decrement: p.quantity } },
          })
        )
      );

      await tx.inventoryMovement.createMany({
        data: products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
          movementType: MovementType.out,
          reason: MovementReason.sale,
          adminId: assignedDeliveryId,
          createdAt: currentDate,
        })),
      });

      const newOrder = await tx.order.create({
        data: {
          ...orderData,
          totalAmount,
          state: OrderState.pending,
          deliveryId: assignedDeliveryId,
          customerId,
          orderProducts: { create: orderProductsData },
        },
        include: {
          customer: { select: userSelectBasic },
          delivery: { select: userSelectBasic },
          orderProducts: {
            include: { product: { select: productSelectBasic } },
          },
        },
      });

      return newOrder;
    });
  },

  async updateState(
    id: number,
    data: UpdateOrderStateData
  ): Promise<OrderEntity> {
    return await prisma.order.update({
      where: { id },
      data: { state: data.state },
      include: {
        orderProducts: {
          include: { product: { select: productSelectBasic } },
        },
        customer: { select: userSelectBasic },
        delivery: { select: userSelectBasic },
      },
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

      const currentDate = new Date();
      const adminId =
        orderWithProducts.deliveryId || orderWithProducts.customerId;

      await Promise.all(
        orderWithProducts.orderProducts.map((p) =>
          tx.product.update({
            where: { id: p.productId },
            data: { stock: { increment: p.quantity } },
          })
        )
      );

      await tx.inventoryMovement.createMany({
        data: orderWithProducts.orderProducts.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
          movementType: MovementType.in,
          reason: MovementReason.return_from_customer,
          adminId,
          createdAt: currentDate,
        })),
      });

      const canceledOrder = await tx.order.update({
        where: { id },
        data: {
          state: OrderState.cancelled,
          cancelledAt: currentDate,
        },
        include: {
          orderProducts: {
            include: { product: { select: productSelectBasic } },
          },
          customer: { select: userSelectBasic },
          delivery: { select: userSelectBasic },
        },
      });

      return canceledOrder;
    });
  },

  async completeOrder(id: number): Promise<OrderEntity> {
    return await prisma.order.update({
      where: { id },
      data: {
        state: OrderState.delivered,
        deliveredAt: new Date(),
      },
      include: {
        orderProducts: {
          include: { product: { select: productSelectBasic } },
        },
        customer: { select: userSelectBasic },
        delivery: { select: userSelectBasic },
      },
    });
  },

  async deleteOrder(id: number): Promise<OrderEntity> {
    return await prisma.order.delete({
      where: { id },
      include: {
        orderProducts: {
          include: { product: { select: productSelectBasic } },
        },
        customer: { select: userSelectBasic },
        delivery: { select: userSelectBasic },
      },
    });
  },

  async findByDelivery(deliveryId: number): Promise<OrderEntity[]> {
    return await prisma.order.findMany({
      where: { deliveryId },
      include: {
        orderProducts: {
          include: {
            product: {
              select: productSelectBasic,
            },
          },
        },
        customer: {
          select: userSelectBasic,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findByCustomer(customerId: number): Promise<OrderEntity[]> {
    return await prisma.order.findMany({
      where: { customerId },
      include: {
        orderProducts: {
          include: {
            product: {
              select: productSelectBasic,
            },
          },
        },
        delivery: {
          select: userSelectBasic,
        },
      },
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
