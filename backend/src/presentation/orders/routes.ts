import { Router } from 'express';

import { orderDatasourceImplementation } from '@/infrastructure/datasource/order.datasource.impl';
import { orderRepositoryImplementation } from '@/infrastructure/repositories/order.repository.impl';

import { orderController } from './controller';

export const orderRoutes = (): Router => {
  const router = Router();

  const orderRepository = orderRepositoryImplementation(
    orderDatasourceImplementation
  );

  const controller = orderController(orderRepository);

  router.get('/reports/all-orders', controller.getOrdersReport);

  router.get('/', controller.getAllOrders);
  router.post('/', controller.createOrder);

  router.get('/:id', controller.getOrderById);
  router.delete('/:id', controller.deleteOrder);

  router.patch('/:id/update-state', controller.updateState);
  router.patch('/:id/cancel', controller.cancelOrder);

  return router;
};
