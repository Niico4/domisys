import { Router } from 'express';
import { addressRepositoryImplementation } from '@/infrastructure/repositories/address.repository.impl';
import { addressController } from './controller';
import { isAuthenticated } from '@/shared/auth/auth.middleware';
import { addressDatasourceImplementation } from '@/infrastructure/datasource/address.datasource.impl';

export const addressRoutes = (): Router => {
  const router = Router();

  const addressRepository = addressRepositoryImplementation(
    addressDatasourceImplementation
  );

  const controller = addressController(addressRepository);

  router.use(isAuthenticated);

  router.get('/', controller.getUserAddresses);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};
