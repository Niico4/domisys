import { SaleDatasource } from '@/domain/datasources/sale.datasource';
import { SaleRepository } from '@/domain/repositories/sale.repository';

export const saleRepositoryImplementation = (
  datasource: SaleDatasource
): SaleRepository => ({
  getAll: () => datasource.getAll(),
  findById: (id: number) => datasource.findById(id),
  createSale: (data, cashierId: number) => datasource.createSale(data, cashierId),
  cancelSale: (id: number, cashierId: number) => datasource.cancelSale(id, cashierId),
  deleteSale: (id: number) => datasource.deleteSale(id),

  getSalesReport: (dto) => datasource.getSalesReport(dto),
});
