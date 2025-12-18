import { CategoryReportDtoType } from '@/domain/dtos/categories/category-report.dto';
import { CategoryReportEntity } from '@/domain/entities/category-report.entity';
import { CategoryRepository } from '@/domain/repositories/category.repository';

export interface GetCategoryReportUseCase {
  execute(dto?: CategoryReportDtoType): Promise<CategoryReportEntity[]>;
}

export class GetCategoryReport implements GetCategoryReportUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  execute(dto?: CategoryReportDtoType): Promise<CategoryReportEntity[]> {
    return this.repository.getCategoryReport(dto);
  }
}
