import { OrderState, PaymentMethod } from '@/generated/enums';
import { Decimal } from '@/generated/internal/prismaNamespace';

export type OrderProductEntity = {
  readonly productId: number;
  readonly quantity: number;
  readonly unitPrice: Decimal;
};

export class OrderEntity {
  constructor(
    public readonly id: number,
    public readonly state: OrderState,
    public readonly paymentMethod: PaymentMethod,
    public readonly totalAmount: Decimal,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly customerId: number | null,
    public readonly deliveryId: number | null,
    public readonly orderProducts?: OrderProductEntity[]
  ) {}
}
