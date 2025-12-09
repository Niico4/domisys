import { Router } from 'express';

import { authRepositoryImplementation } from '@/infrastructure/repositories/auth.repository.impl';
import { authDatasourceImplementation } from '@/infrastructure/datasource/auth.datasource.impl';
import { accessCodeRepositoryImplementation } from '@/infrastructure/repositories/access-code.repository.impl';
import { accessCodeDatasourceImplementation } from '@/infrastructure/datasource/access-code.datasource.impl';

import { authController } from './controller';
import { refreshTokenController } from './refresh-token.controller';

export const authRoutes = (): Router => {
  const router = Router();

  const authRepo = authRepositoryImplementation(authDatasourceImplementation);
  const accessCodeRepo = accessCodeRepositoryImplementation(
    accessCodeDatasourceImplementation
  );

  const controller = authController(authRepo, accessCodeRepo);
  const refreshController = refreshTokenController(authRepo);

  // Public routes
  router.post('/login', controller.login);
  router.post('/register', controller.register);
  router.post('/refresh-token', refreshController.refreshToken);

  return router;
};
