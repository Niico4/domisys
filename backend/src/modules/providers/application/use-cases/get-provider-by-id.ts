import { ProviderEntity } from '../../domain/provider.entity';
import { ProviderRepository } from '../../domain/provider.repository';

export interface GetProviderByIdUseCase {
  execute(id: number): Promise<ProviderEntity>;
}

export class GetProviderById implements GetProviderByIdUseCase {
  constructor(private readonly repository: ProviderRepository) {}

  execute(id: number): Promise<ProviderEntity> {
    return this.repository.findById(id);
  }
}
