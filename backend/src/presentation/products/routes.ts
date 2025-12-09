import { Router } from 'express';
import { UserRole } from '@/generated/enums';

import { productRepositoryImplementation } from '@/infrastructure/repositories/product.repository.impl';

import { productController } from './controller';
import { productDatasourceImplementation } from '@/infrastructure/datasource/product.datasource.impl';
import { providerRepositoryImplementation } from '@/infrastructure/repositories/provider.repository.impl';
import { providerDatasourceImplementation } from '@/infrastructure/datasource/provider.datasource.impl';
import { isAuthenticated, hasRole } from '@/shared/auth/auth.middleware';

export const productRoutes = (): Router => {
  const router = Router();

  const productRepository = productRepositoryImplementation(
    productDatasourceImplementation
  );
  const providerRepository = providerRepositoryImplementation(
    providerDatasourceImplementation
  );

  const controller = productController(productRepository, providerRepository);

  router.use(isAuthenticated);

  router.get(
    '/reports/inventory',
    hasRole(UserRole.admin),
    controller.inventoryReport
  );
  router.get(
    '/reports/inventory-movement',
    hasRole(UserRole.admin),
    controller.getInventoryMovementReport
  );
  router.get(
    '/alerts/low-stock',
    hasRole(UserRole.admin),
    controller.getStockAlerts
  );

  router.get('/', controller.getAllProducts);
  router.get('/:id', controller.getProductById);

  router.post('/', hasRole(UserRole.admin), controller.createProduct);
  router.put('/:id', hasRole(UserRole.admin), controller.updateProduct);
  router.delete('/:id', hasRole(UserRole.admin), controller.deleteProduct);

  router.patch(
    '/:id/update-state',
    hasRole(UserRole.admin),
    controller.updateState
  );

  router.patch('/:id/stock/add', hasRole(UserRole.admin), controller.addStock);
  router.patch(
    '/:id/stock/remove',
    hasRole(UserRole.admin),
    controller.removeStock
  );

  return router;
};
