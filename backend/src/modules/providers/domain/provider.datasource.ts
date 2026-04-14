import { ProviderEntity } from './provider.entity';

export interface ProviderDatasource {
  getAll(): Promise<ProviderEntity[]>;
  findById(id: number): Promise<ProviderEntity | null>;
  findByNit(nit: string): Promise<ProviderEntity | null>;

  create(data: ProviderEntity): Promise<ProviderEntity>;
  update(id: number, data: Partial<ProviderEntity>): Promise<ProviderEntity>;
  delete(id: number): Promise<void>;
  // getProviderReport(dto?: ProviderReportDtoType): Promise<ProviderReportEntity[]>;
}
