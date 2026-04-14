import { ProviderRepository } from '../../domain/provider.repository';

export interface DeleteProviderUseCase {
  execute(id: number): Promise<void>;
}

export class DeleteProvider implements DeleteProviderUseCase {
  constructor(private readonly repository: ProviderRepository) {}

  execute(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}
