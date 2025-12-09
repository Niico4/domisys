import { CreateSaleDtoType } from '../dtos/sales/create-sale.dto';
import { SalesReportDtoType } from '../dtos/sales/sales-report.dto';
import { SaleEntity } from '../entities/sale.entity';

export interface SaleRepository {
  getAll(): Promise<SaleEntity[]>;
  findById(id: number): Promise<SaleEntity>;
  createSale(data: CreateSaleDtoType, cashierId: number): Promise<SaleEntity>;
  cancelSale(id: number, cashierId: number): Promise<SaleEntity>;
  deleteSale(id: number): Promise<SaleEntity>;
  getSalesReport(dto?: SalesReportDtoType): Promise<SaleEntity[]>;
}
