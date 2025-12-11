export enum AccessCodeRole {
  admin = 'admin',
  delivery = 'delivery',
  cashier = 'cashier',
}

export enum AccessCodeState {
  active = 'active',
  used = 'used',
  expired = 'expired',
  disabled = 'disabled',
}

export interface AccessCode {
  id: number;
  code: string;
  role: AccessCodeRole;
  status: AccessCodeState;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
}

export interface CreateAccessCodePayload {
  role: AccessCodeRole;
}
