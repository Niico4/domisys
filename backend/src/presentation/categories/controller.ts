import { Request, Response } from 'express';

import { createCategoryDto } from '@/domain/dtos/categories/create-category.dto';
import { updateCategoryDto } from '@/domain/dtos/categories/update-category.dto';
import { categoryReportDto } from '@/domain/dtos/categories/category-report.dto';
import { CategoryRepository } from '@/domain/repositories/category.repository';

import { GetAllCategories } from '@/domain/use-cases/category/get-all-categories';
import { CreateCategory } from '@/domain/use-cases/category/create-category';
import { GetCategoryById } from '@/domain/use-cases/category/get-category-by-id';
import { DeleteCategory } from '@/domain/use-cases/category/delete-category';
import { UpdateCategory } from '@/domain/use-cases/category/update-category';
import { GetCategoryReport } from '@/domain/use-cases/category/get-category-report';

import { ResponseHandler } from '@/shared/http/response-handler';
import { validateId } from '@/shared/utils/validate-id';
import { messages } from '@/shared/messages';

export const categoryController = (categoryRepository: CategoryRepository) => ({
  getAllCategories: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllCategories(categoryRepository);
      const data = await useCase.execute();

      return ResponseHandler.ok(res, messages.category.getAllSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.category.getAllError()
      );
    }
  },

  getCategoryById: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);

      const useCase = new GetCategoryById(categoryRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(res, messages.category.getByIdSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.category.getByIdError()
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
        messages.category.created(data.name),
        data,
        201
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.category.createError()
      );
    }
  },

  updateCategory: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);
      const dto = updateCategoryDto.parse(req.body);

      const useCase = new UpdateCategory(categoryRepository);
      const data = await useCase.execute(id, dto);

      return ResponseHandler.ok(
        res,
        messages.category.updated(data.name),
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.category.updateError()
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
        messages.category.deleted(data.name),
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.category.deleteError()
      );
    }
  },

  getCategoryReport: async (req: Request, res: Response) => {
    try {
      const dto = categoryReportDto.parse(req.query);

      const useCase = new GetCategoryReport(categoryRepository);
      const data = await useCase.execute(dto);

      return ResponseHandler.ok(res, messages.category.reportSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.category.reportError()
      );
    }
  },
});
