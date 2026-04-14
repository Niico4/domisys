import { Router } from 'express';

import { UserRole } from '@generated/enums';
import { isAuthenticated, hasRole } from '@shared/auth/auth.middleware';

import { providerDatasourceImplementation } from '../provider.datasource.impl';
import { providerRepositoryImplementation } from '../provider.repository.impl';
import { providerController } from './provider.controller';

export const providerRoutes = (): Router => {
  const router = Router();

  const providerRepository = providerRepositoryImplementation(
    providerDatasourceImplementation
  );

  const controller = providerController(providerRepository);

  router.use(isAuthenticated);

  // router.get('/report', hasRole(UserRole.admin), controller.getProviderReport);

  router.get('/', controller.getAllProviders);
  router.get('/:id', controller.getProviderById);

  router.post('/', hasRole(UserRole.admin), controller.createProvider);
  router.put('/:id', hasRole(UserRole.admin), controller.updateProvider);
  router.delete('/:id', hasRole(UserRole.admin), controller.deleteProvider);

  return router;
};
