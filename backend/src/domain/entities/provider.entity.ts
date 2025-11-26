export class ProviderEntity {
  constructor(
    public id: number,
    public name: string,
    public nit: string,
    public email: string,
    public contactNumber: string,
    public address: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
