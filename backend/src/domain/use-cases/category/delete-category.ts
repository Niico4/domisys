import { CategoryEntity } from '@/domain/entities/category.entity';
import { CategoryRepository } from '@/domain/repositories/category.repository';

export interface DeleteCategoryUseCase {
  execute(id: number): Promise<CategoryEntity>;
}

export class DeleteCategory implements DeleteCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  execute(id: number): Promise<CategoryEntity> {
    return this.repository.delete(id);
  }
}
