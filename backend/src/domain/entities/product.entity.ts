import { Decimal } from '@prisma/client/runtime/client';

export class ProductEntity {
  constructor(
    public id: number,
    public name: string,
    public price: Decimal,
    public stock: number,
    public measure: string,
    public lot: string,
    public expirationDate: Date | null,
    public image: string | null,
    public createdAt: Date,
    public updatedAt: Date,
    public state: 'active' | 'inactive',
    public providerId: number | null,
    public categoryId: number | null
  ) {}
}
