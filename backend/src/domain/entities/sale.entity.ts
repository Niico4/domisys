import { Decimal } from '@/generated/internal/prismaNamespace';
import { PaymentMethod, SaleState } from '@/generated/enums';

export type SaleProductEntity = {
  readonly productId: number;
  readonly quantity: number;
  readonly price: Decimal;
};

export class SaleEntity {
  constructor(
    public readonly id: number,
    public readonly paymentMethod: PaymentMethod,
    public readonly state: SaleState,
    public readonly totalAmount: Decimal,
    public readonly createdAt: Date,
    public readonly cancelledAt: Date | null,
    public readonly cashierId: number,
    public readonly saleProducts?: SaleProductEntity[]
  ) {}
}
