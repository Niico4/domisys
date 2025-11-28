import { Router } from 'express';

import { providerRoutes } from './providers/routes';
import { categoriesRoutes } from './categories/routes';
import { productRoutes } from './products/routes';

export const appRoutes = (): Router => {
  const router = Router();

  router.use('/api/providers', providerRoutes());
  router.use('/api/categories', categoriesRoutes());
  router.use('/api/products', productRoutes());

  return router;
};
