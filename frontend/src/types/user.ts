import { UserRole } from './inventory/enums/user-role';

export interface User {
  id: number;
  role: UserRole;
  username: string;
  email: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}
