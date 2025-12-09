import { Router } from 'express';

import { providerRoutes } from './providers/routes';
import { categoriesRoutes } from './categories/routes';
import { productRoutes } from './products/routes';
import { orderRoutes } from './orders/routes';
import { saleRoutes } from './sales/routes';
import { authRoutes } from './auth/routes';
import { accessCodeRoutes } from './access-codes/routes';
import { userRoutes } from './user/routes';
import { addressRoutes } from './addresses/routes';

export const appRoutes = (): Router => {
  const router = Router();

  router.use('/api/auth', authRoutes());
  router.use('/api/access-codes', accessCodeRoutes());
  router.use('/api/users', userRoutes());
  router.use('/api/addresses', addressRoutes());
  router.use('/api/providers', providerRoutes());
  router.use('/api/categories', categoriesRoutes());
  router.use('/api/products', productRoutes());
  router.use('/api/orders', orderRoutes());
  router.use('/api/sales', saleRoutes());

  return router;
};
