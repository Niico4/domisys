import { CreateProviderDtoType } from '@/domain/dtos/providers/create-provider.dto';
import { ProviderEntity } from '@/domain/entities/provider.entity';
import { ProviderRepository } from '@/domain/repositories/provider.repository';

export interface CreateProviderUseCase {
  execute(dto: CreateProviderDtoType): Promise<ProviderEntity>;
}

export class CreateProvider implements CreateProviderUseCase {
  constructor(private readonly repository: ProviderRepository) {}

  execute(dto: CreateProviderDtoType): Promise<ProviderEntity> {
    return this.repository.create(dto);
  }
}
