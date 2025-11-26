import { UpdateProviderDtoType } from '@/domain/dtos/providers/update-provider.dto';
import { ProviderEntity } from '@/domain/entities/provider.entity';
import { ProviderRepository } from '@/domain/repositories/provider.repository';

export interface UpdateProviderUseCase {
  execute(id: number, dto: UpdateProviderDtoType): Promise<ProviderEntity>;
}

export class UpdateProvider implements UpdateProviderUseCase {
  constructor(private readonly repository: ProviderRepository) {}

  execute(id: number, dto: UpdateProviderDtoType): Promise<ProviderEntity> {
    return this.repository.update(id, dto);
  }
}
