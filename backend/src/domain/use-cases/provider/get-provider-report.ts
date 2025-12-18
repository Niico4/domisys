import { ProviderReportDtoType } from '@/domain/dtos/providers/provider-report.dto';
import { ProviderReportEntity } from '@/domain/entities/provider-report.entity';
import { ProviderRepository } from '@/domain/repositories/provider.repository';

export interface GetProviderReportUseCase {
  execute(dto?: ProviderReportDtoType): Promise<ProviderReportEntity[]>;
}

export class GetProviderReport implements GetProviderReportUseCase {
  constructor(private readonly repository: ProviderRepository) {}

  execute(dto?: ProviderReportDtoType): Promise<ProviderReportEntity[]> {
    return this.repository.getProviderReport(dto);
  }
}
