import { UpdateCategoryDtoType } from '@/domain/dtos/categories/update-category.dto';
import { CategoryEntity } from '@/domain/entities/category.entity';
import { CategoryRepository } from '@/domain/repositories/category.repository';

export interface UpdateCategoryUseCase {
  execute(id: number, dto: UpdateCategoryDtoType): Promise<CategoryEntity>;
}

export class UpdateCategory implements UpdateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  execute(id: number, dto: UpdateCategoryDtoType): Promise<CategoryEntity> {
    return this.repository.update(id, dto);
  }
}
