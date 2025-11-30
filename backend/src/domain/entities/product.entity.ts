import { ProductState } from '@/generated/enums';
import { Decimal } from '@/generated/internal/prismaNamespace';

export class ProductEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly price: Decimal | number,
    public readonly stock: number,
    public readonly measure: string,
    public readonly lot: string,
    public readonly expirationDate: Date | null,
    public readonly image: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly state: ProductState,
    public readonly providerId: number | null,
    public readonly categoryId: number | null
  ) {}
}
