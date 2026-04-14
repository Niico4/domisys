import { Router } from 'express';

import { categoriesRoutes } from '../../presentation/categories/routes';
import { productRoutes } from '../../presentation/products/routes';
import { orderRoutes } from '../../presentation/orders/routes';
import { saleRoutes } from '../../presentation/sales/routes';
import { authRoutes } from '../../presentation/auth/routes';
import { accessCodeRoutes } from '../../presentation/access-codes/routes';
import { userRoutes } from '../../presentation/user/routes';
import { addressRoutes } from '../../presentation/addresses/routes';
import { providerRoutes } from '@/modules/providers/infrastructure/http/routes';

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
