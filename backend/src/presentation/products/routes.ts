import { Router } from 'express';
import { UserRole } from '@/generated/enums';

import { productRepositoryImplementation } from '@/infrastructure/repositories/product.repository.impl';

import { productController } from './controller';
import { productDatasourceImplementation } from '@/infrastructure/datasource/product.datasource.impl';
import { isAuthenticated, hasRole } from '@/shared/auth/auth.middleware';

export const productRoutes = (): Router => {
  const router = Router();

  const productRepository = productRepositoryImplementation(
    productDatasourceImplementation
  );

  const controller = productController(productRepository);

  router.use(isAuthenticated);

  router.get(
    '/reports/inventory',
    hasRole(UserRole.admin),
    controller.inventoryReport
  );
  router.get(
    '/inventory/movements',
    hasRole(UserRole.admin),
    controller.getInventoryMovements
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
