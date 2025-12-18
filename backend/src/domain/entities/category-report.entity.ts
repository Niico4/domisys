import { Decimal } from '@/generated/internal/prismaNamespace';

export class CategoryReportEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly totalProducts: number,
    public readonly activeProducts: number,
    public readonly inactiveProducts: number,
    public readonly totalStock: number,
    public readonly totalValue: Decimal | number,
    public readonly lowStockProducts: number
  ) {}
}
