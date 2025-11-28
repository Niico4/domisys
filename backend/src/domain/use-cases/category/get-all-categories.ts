import { CategoryEntity } from '@/domain/entities/category.entity';
import { CategoryRepository } from '@/domain/repositories/category.repository';

export interface GetAllCategoriesUseCase {
  execute(): Promise<CategoryEntity[]>;
}

export class GetAllCategories implements GetAllCategoriesUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  execute(): Promise<CategoryEntity[]> {
    return this.repository.getAll();
  }
}
