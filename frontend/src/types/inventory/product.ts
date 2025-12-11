import { ProductState } from './enums/product-state';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  measure: string;
  lot: string;
  expirationDate: Date | null;
  image: string | null;
  state: ProductState;
  providerId: number | null;
  categoryId: number | null;
  provider?: {
    id: number;
    name: string;
  } | null;
  category?: {
    id: number;
    name: string;
  } | null;
}
