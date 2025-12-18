import { CategoryDatasource } from '@/domain/datasources/category.datasource';
import { CreateCategoryDtoType } from '@/domain/dtos/categories/create-category.dto';
import { UpdateCategoryDtoType } from '@/domain/dtos/categories/update-category.dto';
import { CategoryReportDtoType } from '@/domain/dtos/categories/category-report.dto';
import { CategoryRepository } from '@/domain/repositories/category.repository';

export const categoryRepositoryImplementation = (
  datasource: CategoryDatasource
): CategoryRepository => ({
  getAll: () => datasource.getAll(),
  findById: (id: number) => datasource.findById(id),

  create: (data: CreateCategoryDtoType) => datasource.create(data),
  update: (id: number, data: UpdateCategoryDtoType) =>
    datasource.update(id, data),
  delete: (id: number) => datasource.delete(id),
  
  getCategoryReport: (dto?: CategoryReportDtoType) => 
    datasource.getCategoryReport(dto),
});
