import { Router } from 'express';
import { UserRole } from '@/generated/enums';

import { providerRepositoryImplementation } from '@/infrastructure/repositories/provider.repository.impl';
import { providerDatasourceImplementation } from '@/infrastructure/datasource/provider.datasource.impl';
import { providerController } from './controller';
import { isAuthenticated, hasRole } from '@/shared/auth/auth.middleware';

export const providerRoutes = (): Router => {
  const router = Router();

  const providerRepository = providerRepositoryImplementation(
    providerDatasourceImplementation
  );

  const controller = providerController(providerRepository);

  router.use(isAuthenticated);

  router.get('/', controller.getAllProviders);
  router.get('/:id', controller.getProviderById);

  router.post('/', hasRole(UserRole.admin), controller.createProvider);
  router.put('/:id', hasRole(UserRole.admin), controller.updateProvider);
  router.delete('/:id', hasRole(UserRole.admin), controller.deleteProvider);

  return router;
};
