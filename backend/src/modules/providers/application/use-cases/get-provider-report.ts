import { ProviderReportEntity } from '@/domain/entities/provider-report.entity';
import { ProviderRepository } from '../../domain/provider.repository';
import { ProviderReportDtoType } from '../dtos/provider-report.dto';

export interface GetProviderReportUseCase {
  execute(dto?: ProviderReportDtoType): Promise<ProviderReportEntity[]>;
}

export class GetProviderReport implements GetProviderReportUseCase {
  constructor(private readonly repository: ProviderRepository) {}

  execute(dto?: ProviderReportDtoType): Promise<ProviderReportEntity[]> {
    return this.repository.getProviderReport(dto);
  }
}
