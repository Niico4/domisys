import { Router } from 'express';

import { providerRepositoryImplementation } from '@/infrastructure/repositories/provider.repository.impl';

import { providerController } from './controller';
import { providerDatasourceImplementation } from '@/infrastructure/datasource/provider.datasource.impl';

export const providerRoutes = (): Router => {
  const router = Router();

  const providerRepository = providerRepositoryImplementation(
    providerDatasourceImplementation
  );

  const controller = providerController(providerRepository);

  router.get('/', controller.getAllProviders);
  router.post('/', controller.createProvider);

  router.get('/:id', controller.getProviderById);
  router.put('/:id', controller.updateProvider);
  router.delete('/:id', controller.deleteProvider);

  return router;
};
