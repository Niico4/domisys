import { ProductState } from '@/generated/enums';
import { Decimal } from '@/generated/internal/prismaNamespace';

export class ProductEntity {
  constructor(
    public id: number,
    public name: string,
    public price: Decimal | number,
    public stock: number,
    public measure: string,
    public lot: string,
    public expirationDate: Date | null,
    public image: string | null,
    public createdAt: Date,
    public updatedAt: Date,
    public state: ProductState,
    public providerId: number | null,
    public categoryId: number | null
  ) {}
}
