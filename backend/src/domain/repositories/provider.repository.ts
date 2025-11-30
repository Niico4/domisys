import { CreateProviderDtoType } from '../dtos/providers/create-provider.dto';
import { UpdateProviderDtoType } from '../dtos/providers/update-provider.dto';
import { ProviderEntity } from '../entities/provider.entity';

export interface ProviderRepository {
  getAll(): Promise<ProviderEntity[]>;
  findById(id: number): Promise<ProviderEntity>;
  create(data: CreateProviderDtoType): Promise<ProviderEntity>;
  update(id: number, data: UpdateProviderDtoType): Promise<ProviderEntity>;
  delete(id: number): Promise<ProviderEntity>;
}
