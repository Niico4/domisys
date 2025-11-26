import { ProviderEntity } from '@/domain/entities/provider.entity';
import { ProviderRepository } from '@/domain/repositories/provider.repository';

export interface DeleteProviderUseCase {
  execute(id: number): Promise<ProviderEntity>;
}

export class DeleteProvider implements DeleteProviderUseCase {
  constructor(private readonly repository: ProviderRepository) {}

  execute(id: number): Promise<ProviderEntity> {
    return this.repository.delete(id);
  }
}
