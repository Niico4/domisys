import { ProviderDatasource } from '../domain/provider.datasource';
import { ProviderEntity } from '../domain/provider.entity';
import { ProviderRepository } from '../domain/provider.repository';

export const providerRepositoryImplementation = (
  datasource: ProviderDatasource
): ProviderRepository => ({
  getAll: () => datasource.getAll(),
  findById: (id: number) => datasource.findById(id),
  findByNit: (nit: string) => datasource.findByNit(nit),

  create: (data: ProviderEntity) => datasource.create(data),
  update: (id: number, data: Partial<ProviderEntity>) =>
    datasource.update(id, data),
  delete: (id: number) => datasource.delete(id),

  // getProviderReport: (dto?: ProviderReportDtoType) =>
  //   datasource.getProviderReport(dto),
});
