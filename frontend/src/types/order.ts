import { PaymentMethod } from './payment-method';

export enum OrderState {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCEL = 'cancel',
}

export interface OrderProduct {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product?: {
    id: number;
    name: string;
    image?: string | null;
  };
}

export interface Order {
  id: number;
  state: OrderState;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  customerId: number | null;
  deliveryId: number | null;
  addressId: number;
  orderProducts?: OrderProduct[];
  address?: {
    id: number;
    alias: string;
    city: string;
    neighborhood: string;
    street: string;
    details?: string | null;
  };
  customer?: {
    id: number;
    name: string;
    lastName: string;
    phoneNumber: string;
  };
  delivery?: {
    id: number;
    name: string;
    lastName: string;
    phoneNumber: string;
  };
}

export interface CreateOrderPayload {
  paymentMethod: PaymentMethod;
  addressId: number;
  products: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface UpdateOrderStatePayload {
  state: OrderState;
}
