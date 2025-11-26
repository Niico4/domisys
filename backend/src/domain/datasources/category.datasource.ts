import { CreateCategoryDtoType } from '../dtos/categories/create-category.dto';
import { UpdateCategoryDtoType } from '../dtos/categories/update-category.dto';
import { CategoryEntity } from '../entities/category.entity';

export interface CategoryDatasource {
  getAll(): Promise<CategoryEntity[]>;
  findById(id: number): Promise<CategoryEntity>;
  create(createCategoryDTO: CreateCategoryDtoType): Promise<CategoryEntity>;
  update(
    id: number,
    updateCategoryDTO: UpdateCategoryDtoType
  ): Promise<CategoryEntity>;
  delete(id: number): Promise<CategoryEntity>;
}
