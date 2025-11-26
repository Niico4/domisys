import { ProviderDatasource } from '@/domain/datasources/provider.datasource';
import { CreateProviderDtoType } from '@/domain/dtos/providers/create-provider.dto';
import { UpdateProviderDtoType } from '@/domain/dtos/providers/update-provider.dto';
import { ProviderRepository } from '@/domain/repositories/provider.repository';

export const providerRepositoryImplementation = (
  datasource: ProviderDatasource
): ProviderRepository => ({
  getAll: () => datasource.getAll(),
  findById: (id: number) => datasource.findById(id),

  create: (data: CreateProviderDtoType) => datasource.create(data),
  update: (id: number, data: UpdateProviderDtoType) =>
    datasource.update(id, data),
  delete: (id: number) => datasource.delete(id),
});
