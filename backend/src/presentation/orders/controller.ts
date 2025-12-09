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

import { GetMyDeliveries } from '@/domain/use-cases/order/get-my-deliveries';
import { GetMyOrders } from '@/domain/use-cases/order/get-my-orders';

import { validateId } from '@/shared/utils/validate-id';
import { ResponseHandler } from '@/shared/http/response-handler';
import { messages } from '@/shared/messages';

export const orderController = (orderRepository: OrderRepository) => ({
  getAllOrders: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllOrders(orderRepository);
      const data = await useCase.execute();

      return ResponseHandler.ok(res, messages.order.getAllSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.order.getAllError()
      );
    }
  },

  getOrderById: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);

      const useCase = new GetOrderById(orderRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(res, messages.order.getByIdSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.order.getByIdError()
      );
    }
  },

  createOrder: async (req: Request, res: Response) => {
    try {
      const dto = createOrderDto.parse(req.body);

      const customerId = req.user!.id;

      const useCase = new CreateOrder(orderRepository);
      const data = await useCase.execute({ ...dto, customerId });

      return ResponseHandler.ok(res, messages.order.createSuccess(), data, 201);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.order.createError()
      );
    }
  },

  updateState: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);
      const { state } = updateOrderStateDto.parse(req.body);

      const useCase = new UpdateOrderState(orderRepository);
      const data = await useCase.execute(id, state);

      return ResponseHandler.ok(res, messages.order.updateStateSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.order.updateStateError()
      );
    }
  },

  deleteOrder: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);

      const useCase = new DeleteOrder(orderRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(res, messages.order.deleted(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.order.deleteError()
      );
    }
  },

  cancelOrder: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);
      const dto = cancelOrderDto.parse(req.body);

      const useCase = new CancelOrder(orderRepository);
      const data = await useCase.execute(id, dto);

      return ResponseHandler.ok(res, messages.order.cancelSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.order.cancelError()
      );
    }
  },

  getOrdersReport: async (req: Request, res: Response) => {
    try {
      const dto = ordersReportDto.parse(req.query);

      const useCase = new GetOrdersReport(orderRepository);
      const data = await useCase.execute(dto);

      return ResponseHandler.ok(res, messages.order.reportSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.order.reportError()
      );
    }
  },

  getMyDeliveries: async (req: Request, res: Response) => {
    try {
      const deliveryId = req.user!.id;

      const useCase = new GetMyDeliveries(orderRepository);
      const data = await useCase.execute(deliveryId);

      return ResponseHandler.ok(res, messages.order.deliveriesSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.order.deliveriesError()
      );
    }
  },

  getMyOrders: async (req: Request, res: Response) => {
    try {
      const customerId = req.user!.id;

      const useCase = new GetMyOrders(orderRepository);
      const data = await useCase.execute(customerId);

      return ResponseHandler.ok(
        res,
        messages.order.customerOrdersSuccess(),
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.order.customerOrdersError()
      );
    }
  },
});
