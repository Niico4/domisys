import { CreateCategoryDtoType } from '../dtos/categories/create-category.dto';
import { UpdateCategoryDtoType } from '../dtos/categories/update-category.dto';
import { CategoryReportDtoType } from '../dtos/categories/category-report.dto';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryReportEntity } from '../entities/category-report.entity';

export interface CategoryDatasource {
  getAll(): Promise<CategoryEntity[]>;
  findById(id: number): Promise<CategoryEntity>;
  create(data: CreateCategoryDtoType): Promise<CategoryEntity>;
  update(id: number, data: UpdateCategoryDtoType): Promise<CategoryEntity>;
  delete(id: number): Promise<CategoryEntity>;
  getCategoryReport(dto?: CategoryReportDtoType): Promise<CategoryReportEntity[]>;
}
