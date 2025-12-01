import { Decimal } from '@/generated/internal/prismaNamespace';
import { PaymentMethod, SaleState } from '@/generated/enums';

export type SaleProductEntity = {
  readonly productId: number;
  readonly quantity: number;
  readonly unitPrice: Decimal;
};

export class SaleEntity {
  constructor(
    public readonly id: number,
    public readonly paymentMethod: PaymentMethod,
    public readonly state: SaleState,
    public readonly totalAmount: Decimal,
    public readonly createdAt: Date,
    public readonly cashierId: number | null,
    public readonly saleProducts?: SaleProductEntity[]
  ) {}
}
