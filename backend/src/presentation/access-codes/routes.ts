import { Router } from 'express';

import { accessCodeRepositoryImplementation } from '@/infrastructure/repositories/access-code.repository.impl';
import { accessCodeDatasourceImplementation } from '@/infrastructure/datasource/access-code.datasource.impl';

import { accessCodeController } from './controller';
import { isAuthenticated, hasRole } from '@/shared/auth/auth.middleware';
import { UserRole } from '@/generated/enums';

export const accessCodeRoutes = (): Router => {
  const router = Router();

  const accessCodeRepo = accessCodeRepositoryImplementation(
    accessCodeDatasourceImplementation
  );

  const controller = accessCodeController(accessCodeRepo);

  router.use(isAuthenticated);
  router.use(hasRole(UserRole.admin));

  router.get('/', controller.getAllCodes);
  router.post('/', controller.createCode);

  router.get('/:id', controller.getCodeById);
  router.delete('/:id', controller.disableCode);

  return router;
};
