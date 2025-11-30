import { CreateCategoryDtoType } from '@/domain/dtos/categories/create-category.dto';
import { CategoryEntity } from '@/domain/entities/category.entity';
import { CategoryRepository } from '@/domain/repositories/category.repository';

export interface CreateCategoryUseCase {
  execute(dto: CreateCategoryDtoType): Promise<CategoryEntity>;
}

export class CreateCategory implements CreateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  execute(dto: CreateCategoryDtoType): Promise<CategoryEntity> {
    return this.repository.create(dto);
  }
}
