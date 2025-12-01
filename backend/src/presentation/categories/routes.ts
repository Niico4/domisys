import { Router } from 'express';

import { categoryRepositoryImplementation } from '@/infrastructure/repositories/category.repository.impl';
import { categoryDatasourceImplementation } from '@/infrastructure/datasource/category.datasource.impl';

import { categoryController } from './controller';

export const categoriesRoutes = (): Router => {
  const router = Router();

  const categoriesRepository = categoryRepositoryImplementation(
    categoryDatasourceImplementation
  );

  const controller = categoryController(categoriesRepository);

  router.get('/', controller.getAllCategories);
  router.post('/', controller.createCategory);

  router.get('/:id', controller.getCategoryById);
  router.put('/:id', controller.updateCategory);
  router.delete('/:id', controller.deleteCategory);

  return router;
};
