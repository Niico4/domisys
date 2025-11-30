import { Request, Response } from 'express';

import { OrderRepository } from '@/domain/repositories/order.repository';

import { cancelOrderDto } from '@/domain/dtos/orders/cancel-order.dto';
import { createOrderDto } from '@/domain/dtos/orders/create-order.dto';
import { ordersReportDto } from '@/domain/dtos/orders/orders-report.dto';
import { updateOrderStateDto } from '@/domain/dtos/orders/update-order-state.dto';

import { CancelOrder } from '@/domain/use-cases/order/cancel-order';
import { CreateOrder } from '@/domain/use-cases/order/create-order';
import { DeleteOrder } from '@/domain/use-cases/order/delete-order';
import { GetAllOrders } from '@/domain/use-cases/order/get-all-orders';
import { GetOrderById } from '@/domain/use-cases/order/get-order-by-id';
import { GetOrdersReport } from '@/domain/use-cases/order/get-orders-report';
import { UpdateOrderState } from '@/domain/use-cases/order/update-order-state';

import { validateId } from '@/shared/utils/validate-id';
import { ResponseHandler } from '@/shared/http/response-handler';

export const orderController = (orderRepository: OrderRepository) => ({
  getAllOrders: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllOrders(orderRepository);
      const data = await useCase.execute();

      return ResponseHandler.ok(res, 'Pedidos obtenidos correctamente.', data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al obtener los pedidos.'
      );
    }
  },

  getOrderById: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);

      const useCase = new GetOrderById(orderRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(res, 'Pedido obtenido correctamente.', data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al obtener el pedido.'
      );
    }
  },

  createOrder: async (req: Request, res: Response) => {
    try {
      const dto = createOrderDto.parse(req.body);

      const useCase = new CreateOrder(orderRepository);
      const data = await useCase.execute(dto);

      return ResponseHandler.ok(res, 'Pedido creado correctamente.', data, 201);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al crear el pedido.'
      );
    }
  },

  updateState: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);
      const { state } = updateOrderStateDto.parse(req.body);

      const useCase = new UpdateOrderState(orderRepository);
      const data = await useCase.execute(id, state);

      return ResponseHandler.ok(
        res,
        'Estado del pedido actualizado correctamente.',
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al actualizar el estado del pedido.'
      );
    }
  },

  deleteOrder: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);

      const useCase = new DeleteOrder(orderRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(res, 'Pedido eliminado correctamente.', data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al eliminar el pedido.'
      );
    }
  },

  cancelOrder: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);
      const dto = cancelOrderDto.parse(req.body);

      const useCase = new CancelOrder(orderRepository);
      const data = await useCase.execute(id, dto);

      return ResponseHandler.ok(res, 'Pedido cancelado correctamente.', data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al cancelar el pedido.'
      );
    }
  },

  getOrdersReport: async (req: Request, res: Response) => {
    try {
      const dto = ordersReportDto.parse(req.query);

      const useCase = new GetOrdersReport(orderRepository);
      const data = await useCase.execute(dto);

      return ResponseHandler.ok(
        res,
        'Reporte de pedidos generado correctamente.',
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al generar el reporte de pedidos.'
      );
    }
  },
});
