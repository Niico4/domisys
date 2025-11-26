import { CategoryEntity } from '@/domain/entities/category.entity';
import { CategoryRepository } from '@/domain/repositories/category.repository';

export interface GetCategoryByIdUseCase {
  execute(id: number): Promise<CategoryEntity>;
}

export class GetCategoryById implements GetCategoryByIdUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  execute(id: number): Promise<CategoryEntity> {
    return this.repository.findById(id);
  }
}
