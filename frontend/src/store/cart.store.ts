import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  imageUrl?: string;
}

interface CartStore {
  isCartOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
}

const CART_STORAGE_KEY = 'domisys_cart';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      isCartOpen: false,
      items: [],
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          let newItems;
          if (existingItem) {
            // If item exists, increment quantity (ensure it's at least 1)
            newItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Math.max(1, i.quantity + 1) }
                : i
            );
          } else {
            // New item always starts with quantity 1
            newItems = [...state.items, { ...item, quantity: 1 }];
          }
          return { items: newItems };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            return { items: state.items.filter((item) => item.id !== id) };
          }
          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
      getItemQuantity: (id: string) => {
        const item = get().items.find((i) => i.id === id);
        return item?.quantity || 0;
      },
    }),
    {
      name: CART_STORAGE_KEY,
      partialize: (state) => ({ items: state.items }), // Only persist items, not isCartOpen
      // Filter out any items with invalid quantities when loading from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Remove any items with quantity <= 0
          state.items = state.items.filter((item) => item.quantity > 0);
        }
      },
    }
  )
);

