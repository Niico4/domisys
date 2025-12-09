import { Router } from 'express';
import { UserRole } from '@/generated/enums';

import { orderDatasourceImplementation } from '@/infrastructure/datasource/order.datasource.impl';
import { orderRepositoryImplementation } from '@/infrastructure/repositories/order.repository.impl';

import { orderController } from './controller';
import { isAuthenticated, hasRole } from '@/shared/auth/auth.middleware';

export const orderRoutes = (): Router => {
  const router = Router();

  const orderRepository = orderRepositoryImplementation(
    orderDatasourceImplementation
  );

  const controller = orderController(orderRepository);

  router.use(isAuthenticated);

  router.get(
    '/reports/all-orders',
    hasRole(UserRole.admin),
    controller.getOrdersReport
  );

  router.get('/', controller.getAllOrders);

  router.get(
    '/my-deliveries',
    hasRole(UserRole.delivery),
    controller.getMyDeliveries
  );

  router.get('/my-orders', hasRole(UserRole.customer), controller.getMyOrders);
  router.post('/', hasRole(UserRole.customer), controller.createOrder);

  router.get('/:id', controller.getOrderById);

  router.patch(
    '/:id/update-state',
    hasRole(UserRole.delivery),
    controller.updateState
  );

  router.patch(
    '/:id/cancel',
    hasRole(UserRole.customer, UserRole.delivery),
    controller.cancelOrder
  );

  router.delete('/:id', hasRole(UserRole.admin), controller.deleteOrder);

  return router;
};
