import { Router } from 'express';
import { UserRole } from '@/generated/enums';

import { categoryRepositoryImplementation } from '@/infrastructure/repositories/category.repository.impl';
import { categoryDatasourceImplementation } from '@/infrastructure/datasource/category.datasource.impl';

import { categoryController } from './controller';
import { isAuthenticated, hasRole } from '@/shared/auth/auth.middleware';

export const categoriesRoutes = (): Router => {
  const router = Router();

  const categoriesRepository = categoryRepositoryImplementation(
    categoryDatasourceImplementation
  );

  const controller = categoryController(categoriesRepository);

  router.use(isAuthenticated);

  router.get('/', controller.getAllCategories);
  router.get('/:id', controller.getCategoryById);

  router.post('/', hasRole(UserRole.admin), controller.createCategory);
  router.put('/:id', hasRole(UserRole.admin), controller.updateCategory);
  router.delete('/:id', hasRole(UserRole.admin), controller.deleteCategory);

  return router;
};
