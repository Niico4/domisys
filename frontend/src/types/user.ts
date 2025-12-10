export enum UserRole {
  admin = 'admin',
  customer = 'customer',
  cashier = 'cashier',
  delivery = 'delivery',
}

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
