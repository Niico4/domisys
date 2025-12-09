import { UserRole } from '@/generated/enums';

export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly role: UserRole,
    public readonly username: string,
    public readonly email: string,
    public readonly name: string,
    public readonly lastName: string,
    public readonly phoneNumber: string,
    public readonly password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
