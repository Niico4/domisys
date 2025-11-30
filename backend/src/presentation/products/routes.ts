import { Router } from 'express';

import { productRepositoryImplementation } from '@/infrastructure/repositories/product.repository.impl';

import { productController } from './controller';
import { productDatasourceImplementation } from '@/infrastructure/datasource/product.datasource.impl';
import { providerRepositoryImplementation } from '@/infrastructure/repositories/provider.repository.impl';
import { providerDatasourceImplementation } from '@/infrastructure/datasource/provider.datasource.impl';

export const productRoutes = (): Router => {
  const router = Router();

  const productRepository = productRepositoryImplementation(
    productDatasourceImplementation
  );
  const providerRepository = providerRepositoryImplementation(
    providerDatasourceImplementation
  );

  const controller = productController(productRepository, providerRepository);

  router.get('/reports/inventory', controller.inventoryReport);
  router.get(
    '/reports/inventory-movement',
    controller.getInventoryMovementReport
  );

  router.get('/alerts/low-stock', controller.getStockAlerts);

  router.get('/', controller.getAllProducts);
  router.post('/', controller.createProduct);

  router.get('/:id', controller.getProductById);
  router.put('/:id', controller.updateProduct);
  router.delete('/:id', controller.deleteProduct);

  router.patch('/:id/update-state', controller.updateState);

  router.patch('/:id/stock/add', controller.addStock);
  router.patch('/:id/stock/remove', controller.removeStock);

  return router;
};
