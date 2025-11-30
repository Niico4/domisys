import { Request, Response } from 'express';

import { createCategoryDto } from '@/domain/dtos/categories/create-category.dto';
import { updateCategoryDto } from '@/domain/dtos/categories/update-category.dto';
import { CategoryRepository } from '@/domain/repositories/category.repository';

import { GetAllCategories } from '@/domain/use-cases/category/get-all-categories';
import { CreateCategory } from '@/domain/use-cases/category/create-category';
import { GetCategoryById } from '@/domain/use-cases/category/get-category-by-id';
import { DeleteCategory } from '@/domain/use-cases/category/delete-category';
import { UpdateCategory } from '@/domain/use-cases/category/update-category';
import { ResponseHandler } from '@/shared/http/response-handler';
import { validateId } from '@/shared/utils/validate-id';

export const categoryController = (categoryRepository: CategoryRepository) => ({
  getAllCategories: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllCategories(categoryRepository);
      const data = await useCase.execute();

      return ResponseHandler.ok(
        res,
        'Categorías obtenidas correctamente.',
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al obtener las categorías.'
      );
    }
  },

  getCategoryById: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);

      const useCase = new GetCategoryById(categoryRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(res, 'Categoría obtenida correctamente.', data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        `Error al obtener la categoría.`
      );
    }
  },

  createCategory: async (req: Request, res: Response) => {
    try {
      const dto = createCategoryDto.parse(req.body);

      const useCase = new CreateCategory(categoryRepository);
      const data = await useCase.execute(dto);

      return ResponseHandler.ok(
        res,
        'Categoría creada correctamente.',
        data,
        201
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al crear la categoría.'
      );
    }
  },

  updateCategory: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);
      const dto = updateCategoryDto.parse(req.body ?? {});

      const useCase = new UpdateCategory(categoryRepository);
      const data = await useCase.execute(id, dto);

      return ResponseHandler.ok(
        res,
        'Categoría actualizada correctamente.',
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al actualizar la categoría.'
      );
    }
  },

  deleteCategory: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);

      const useCase = new DeleteCategory(categoryRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(
        res,
        'Categoría eliminada correctamente.',
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al eliminar la categoría.'
      );
    }
  },
});
