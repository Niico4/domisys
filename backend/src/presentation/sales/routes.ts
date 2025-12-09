import { Router } from 'express';
import { UserRole } from '@/generated/enums';

import { saleDatasourceImplementation } from '@/infrastructure/datasource/sale.datasource.impl';
import { saleRepositoryImplementation } from '@/infrastructure/repositories/sale.repository.impl';
import { saleController } from './controller';

import { isAuthenticated, hasRole } from '@/shared/auth/auth.middleware';

export const saleRoutes = (): Router => {
  const router = Router();

  const saleRepository = saleRepositoryImplementation(
    saleDatasourceImplementation
  );

  const controller = saleController(saleRepository);

  router.use(isAuthenticated);

  router.get(
    '/reports/all-sales',
    hasRole(UserRole.admin),
    controller.getSalesReport
  );

  router.get(
    '/',
    hasRole(UserRole.cashier, UserRole.admin),
    controller.getAllSales
  );
  router.post('/', hasRole(UserRole.cashier), controller.createSale);
  router.get(
    '/:id',
    hasRole(UserRole.cashier, UserRole.admin),
    controller.getSaleById
  );

  router.patch(
    '/:id/cancel',
    hasRole(UserRole.cashier, UserRole.admin),
    controller.cancelSale
  );
  router.delete('/:id', hasRole(UserRole.admin), controller.deleteSale);

  return router;
};
