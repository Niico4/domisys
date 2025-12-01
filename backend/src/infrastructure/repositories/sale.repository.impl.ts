import { SaleDatasource } from '@/domain/datasources/sale.datasource';
import { SaleRepository } from '@/domain/repositories/sale.repository';

export const saleRepositoryImplementation = (
  datasource: SaleDatasource
): SaleRepository => ({
  getAll: () => datasource.getAll(),
  findById: (id: number) => datasource.findById(id),
  createSale: (data) => datasource.createSale(data),
  cancelSale: (id: number, dto) => datasource.cancelSale(id, dto),
  deleteSale: (id: number) => datasource.deleteSale(id),

  getSalesReport: (dto) => datasource.getSalesReport(dto),
});
