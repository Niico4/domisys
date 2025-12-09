import { Router } from 'express';
import { userRepositoryImplementation } from '@/infrastructure/repositories/user.repository.impl';
import { userDatasourceImplementation } from '@/infrastructure/datasource/user.datasource.impl';
import { userController } from './controller';
import { isAuthenticated } from '@/shared/auth/auth.middleware';

export const userRoutes = (): Router => {
  const router = Router();

  const userRepo = userRepositoryImplementation(userDatasourceImplementation);
  const controller = userController(userRepo);

  router.use(isAuthenticated);

  router.get('/current-user', controller.getCurrentUser);
  router.put('/update-user', controller.updateProfile);
  router.patch('/change-password', controller.changePassword);

  return router;
};
