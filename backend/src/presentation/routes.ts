import { Router } from 'express';

import { providerRoutes } from './providers/routes';
import { categoriesRoutes } from './categories/routes';
import { productRoutes } from './products/routes';
import { orderRoutes } from './orders/routes';

export const appRoutes = (): Router => {
  const router = Router();

  router.use('/api/providers', providerRoutes());
  router.use('/api/categories', categoriesRoutes());
  router.use('/api/products', productRoutes());
  router.use('/api/orders', orderRoutes());

  return router;
};
