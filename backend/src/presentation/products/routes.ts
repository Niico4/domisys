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

  router.get('/', controller.getAllProducts);
  router.post('/', controller.createProduct);

  router.get('/inventory/movement', controller.getInventoryMovementReport);

  router.get('/alerts/low-stock', controller.getStockAlerts);
  router.get('/report', controller.productReport);

  router.get('/:id', controller.getProductById);
  router.put('/:id', controller.updateProduct);
  router.delete('/:id', controller.deleteProduct);

  router.post('/:id/add-stock', controller.addStock);
  router.post('/:id/remove-stock', controller.removeStock);

  return router;
};
