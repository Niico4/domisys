import { Router } from 'express';

import { saleDatasourceImplementation } from '@/infrastructure/datasource/sale.datasource.impl';
import { saleRepositoryImplementation } from '@/infrastructure/repositories/sale.repository.impl';

import { saleController } from './controller';

export const saleRoutes = (): Router => {
  const router = Router();

  const saleRepository = saleRepositoryImplementation(
    saleDatasourceImplementation
  );

  const controller = saleController(saleRepository);

  router.get('/reports/all-sales', controller.getSalesReport);

  router.get('/', controller.getAllSales);
  router.post('/', controller.createSale);

  router.get('/:id', controller.getSaleById);
  router.delete('/:id', controller.deleteSale);

  router.patch('/:id/cancel', controller.cancelSale);

  return router;
};
