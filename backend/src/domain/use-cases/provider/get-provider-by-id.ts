import { ProviderEntity } from '@/domain/entities/provider.entity';
import { ProviderRepository } from '@/domain/repositories/provider.repository';

export interface GetProviderByIdUseCase {
  execute(id: number): Promise<ProviderEntity>;
}

export class GetProviderById implements GetProviderByIdUseCase {
  constructor(private readonly repository: ProviderRepository) {}

  execute(id: number): Promise<ProviderEntity> {
    return this.repository.findById(id);
  }
}
