export class CategoryEntity {
  constructor(
    public id: number,
    public name: string,
    public createdAt: Date,
    public updatedAt: Date,
    public description: string | null
  ) {}
}
