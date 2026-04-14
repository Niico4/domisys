import { ProviderEntity } from '../../domain/provider.entity';
import { ProviderRepository } from '../../domain/provider.repository';

export interface GetAllProvidersUseCase {
  execute(): Promise<ProviderEntity[]>;
}

export class GetAllProviders implements GetAllProvidersUseCase {
  constructor(private readonly repository: ProviderRepository) {}

  execute(): Promise<ProviderEntity[]> {
    return this.repository.getAll();
  }
}
