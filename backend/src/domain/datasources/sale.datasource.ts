import { CancelSaleDtoType } from '../dtos/sales/cancel-sale.dto';
import { CreateSaleDtoType } from '../dtos/sales/create-sale.dto';
import { SalesReportDtoType } from '../dtos/sales/sales-report.dto';
import { SaleEntity } from '../entities/sale.entity';

export interface SaleDatasource {
  getAll(): Promise<SaleEntity[]>;
  findById(id: number): Promise<SaleEntity>;
  createSale(data: CreateSaleDtoType): Promise<SaleEntity>;
  cancelSale(id: number, dto: CancelSaleDtoType): Promise<SaleEntity>;
  deleteSale(id: number): Promise<SaleEntity>;
  getSalesReport(dto?: SalesReportDtoType): Promise<SaleEntity[]>;
}
