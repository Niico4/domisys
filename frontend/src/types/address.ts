export interface Address {
  id: number;
  alias: string;
  city: string;
  neighborhood: string;
  street: string;
  details: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface CreateAddressPayload {
  alias: string;
  city: string;
  neighborhood: string;
  street: string;
  details?: string | null;
  isDefault?: boolean;
}

export interface UpdateAddressPayload {
  alias?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  details?: string | null;
  isDefault?: boolean;
}
