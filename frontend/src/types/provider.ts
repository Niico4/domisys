export interface Provider {
  id: number;
  name: string;
  nit: string;
  email: string;
  contactNumber: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProviderPayload {
  name: string;
  nit: string;
  email: string;
  contactNumber: string;
  address: string;
}
