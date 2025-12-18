import { Decimal } from '@/generated/internal/prismaNamespace';

export class ProviderReportEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly contactNumber: string,
    public readonly totalProducts: number,
    public readonly activeProducts: number,
    public readonly totalPurchases: number,
    public readonly totalReturns: number,
    public readonly totalSpent: Decimal | number
  ) {}
}
