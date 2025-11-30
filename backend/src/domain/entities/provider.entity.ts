export class ProviderEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly nit: string,
    public readonly email: string,
    public readonly contactNumber: string,
    public readonly address: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
