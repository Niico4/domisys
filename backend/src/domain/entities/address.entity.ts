export class AddressEntity {
  constructor(
    public readonly id: number,
    public readonly alias: string,
    public readonly city: string,
    public readonly neighborhood: string,
    public readonly street: string,
    public readonly details: string | null,
    public readonly isDefault: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly userId: number
  ) {}
}
