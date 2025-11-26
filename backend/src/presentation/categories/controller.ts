import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { createCategoryDto } from '@/domain/dtos/categories/create-category.dto';
import { updateCategoryDto } from '@/domain/dtos/categories/update-category.dto';
import { CategoryRepository } from '@/domain/repositories/category.repository';

import { GetAllCategories } from '@/domain/use-cases/category/get-all-category';
import { CreateCategory } from '@/domain/use-cases/category/create-category';
import { GetCategoryById } from '@/domain/use-cases/category/get-category-by-id';
import { DeleteCategory } from '@/domain/use-cases/category/delete-category';
import { UpdateCategory } from '@/domain/use-cases/category/update-category';

import { handleError } from '../errors/http-error-handler';

export const categoryController = (categoryRepository: CategoryRepository) => ({
  getAllCategories: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllCategories(categoryRepository);
      const categories = await useCase.execute();

      return res.status(200).json(categories);
    } catch (error) {
      return handleError(res, error, 'Error al obtener las categorías');
    }
  },

  getCategoryById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID no es un número' });
    }

    try {
      const useCase = new GetCategoryById(categoryRepository);
      const getCategory = await useCase.execute(id);

      return res.status(200).json(getCategory);
    } catch (error) {
      return handleError(res, error, `Error al obtener la categoría ${id}`);
    }
  },

  createCategory: async (req: Request, res: Response) => {
    const data = createCategoryDto.parse(req.body);

    try {
      const useCase = new CreateCategory(categoryRepository);
      const newCategory = await useCase.execute(data);

      return res.status(201).json(newCategory);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return res.status(409).json({
          message: `El ${error.meta?.target} ya está registrado`,
        });
      }

      return handleError(res, error, 'Error al crear la categoría');
    }
  },

  updateCategory: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID no es un número' });
    }

    try {
      const data = updateCategoryDto.parse(req.body ?? {});

      const useCase = new UpdateCategory(categoryRepository);
      const updatedCategory = await useCase.execute(id, data);

      return res.status(200).json(updatedCategory);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return res.status(409).json({
          message: `El ${error.meta?.target} ya está registrado`,
        });
      }

      return handleError(res, error, 'Error al actualizar la categoría');
    }
  },

  deleteCategory: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID no es un número' });
    }

    try {
      const useCase = new DeleteCategory(categoryRepository);
      const deletedCategory = await useCase.execute(id);

      return res.status(200).json(deletedCategory);
    } catch (error) {
      return handleError(res, error, 'Error al eliminar la categoría');
    }
  },
});
