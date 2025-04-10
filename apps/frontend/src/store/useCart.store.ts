import { create } from 'zustand';
import { toast } from 'sonner';

import { Product } from '@/types/product';

export interface ProductWithQuantity extends Product {
  quantity: number;
}

export interface CartStore {
  cart: ProductWithQuantity[];
  addToCart: (product: Omit<ProductWithQuantity, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  cart: [],
  addToCart: (product) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);

      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      toast.success(`${product.productName} añadido al carrito`);
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    });
  },
  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    }));
  },
  clearCart: () => set({ cart: [] }),
}));
