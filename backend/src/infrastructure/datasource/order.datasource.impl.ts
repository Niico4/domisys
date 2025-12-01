import { Prisma } from '@/generated/client';
import { prisma } from '@/data/postgresql';
import { MovementReason, MovementType, OrderState } from '@/generated/enums';

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
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, state: 'active' },
      select: { id: true, name: true, stock: true, price: true },
    });

    if (existingProducts.length !== products.length) {
      throw new BadRequestException(
        'Hay productos inválidos o inactivos en el pedido.'
      );
    }

    // validar stock para cada producto
    for (const orderProduct of products) {
      const product = existingProducts.find(
        (p) => p.id === orderProduct.productId
      );

      if (!product) {
        throw new BadRequestException(
          `Producto con ID ${orderProduct.productId} no encontrado.`
        );
      }

      if (product.stock < orderProduct.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Requerido: ${orderProduct.quantity}`
        );
      }
    }

    return await prisma.$transaction(async (tx) => {
      // Calcular total automáticamente
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
            adminId: deliveryId,
            createdAt: new Date(),
          },
        });
      }

      const newOrder = await tx.order.create({
        data: {
          ...orderData,
          totalAmount, // Calculado automáticamente
          state: OrderState.pending,
          deliveryId,
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

  async cancelOrder(id: number, dto: CancelOrderDtoType): Promise<OrderEntity> {
    await this.findById(id);
    const { customerId, deliveryId, ...data } = dto;

    await userRoleService.validateUserRole(customerId, 'customer');
    await userRoleService.validateUserRole(deliveryId, 'delivery');

    return await prisma.$transaction(async (tx) => {
      const orderWithProducts = await tx.order.findUnique({
        where: { id },
        include: { orderProducts: true },
      });

      if (!orderWithProducts) {
        throw new BadRequestException('Pedido no encontrado.');
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
            adminId: deliveryId,
            createdAt: new Date(),
          },
        });
      }

      const canceledOrder = await tx.order.update({
        where: { id },
        data: { ...data, state: OrderState.cancel },
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
