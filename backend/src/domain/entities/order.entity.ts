import { OrderState, PaymentMethod } from '@/generated/enums';
import { Decimal } from '@/generated/internal/prismaNamespace';

export type OrderProductEntity = {
  readonly productId: number;
  readonly quantity: number;
  readonly price: Decimal;
};

export class OrderEntity {
  constructor(
    public readonly id: number,
    public readonly state: OrderState,
    public readonly paymentMethod: PaymentMethod,
    public readonly totalAmount: Decimal,
    public readonly createdAt: Date,
    public readonly confirmedAt: Date | null,
    public readonly shippedAt: Date | null,
    public readonly deliveredAt: Date | null,
    public readonly cancelledAt: Date | null,
    public readonly customerId: number,
    public readonly deliveryId: number | null,
    public readonly addressId: number,
    public readonly orderProducts?: OrderProductEntity[]
  ) {}
}
