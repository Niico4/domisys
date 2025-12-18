import { Router } from 'express';

import { addressRepositoryImplementation } from '@/infrastructure/repositories/address.repository.impl';
import { authRepositoryImplementation } from '@/infrastructure/repositories/auth.repository.impl';
import { addressDatasourceImplementation } from '@/infrastructure/datasource/address.datasource.impl';
import { authDatasourceImplementation } from '@/infrastructure/datasource/auth.datasource.impl';

import { addressController } from './controller';
import { isAuthenticated } from '@/shared/auth/auth.middleware';

export const addressRoutes = (): Router => {
  const router = Router();

  const addressRepository = addressRepositoryImplementation(
    addressDatasourceImplementation
  );

  const authRepository = authRepositoryImplementation(
    authDatasourceImplementation
  );

  const controller = addressController(addressRepository, authRepository);

  router.use(isAuthenticated);

  router.get('/', controller.getUserAddresses);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};
