'use client';

import { useRouter } from 'next/navigation';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { useCartStore } from '@/store/cart.store';
import { CartItemCard } from './CartItemCard';
import { CartSummary } from './CartSummary';
import { Button } from '@heroui/react';

export const CartBottomSheet = () => {
  const router = useRouter();
  const {
    isCartOpen,
    closeCart,
    items,
    removeItem,
    updateQuantity,
  } = useCartStore();

  const totalProducts = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 3000; // Mock shipping cost
  const total = subtotal + shipping;

  const handleIncreaseQuantity = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      if (item.quantity > 1) {
        updateQuantity(id, item.quantity - 1);
      } else {
        removeItem(id);
      }
    }
  };

  return (
    <BottomSheet
      isOpen={isCartOpen}
      onClose={closeCart}
      title="Carrito de Compras"
      maxHeight="90vh"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-default-500 mb-2">Tu carrito está vacío</p>
              <p className="text-sm text-default-400">
                Agrega productos para comenzar
              </p>
            </div>
          ) : (
            items.map((item) => (
              <CartItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                unit={item.unit}
                quantity={item.quantity}
                imageUrl={item.imageUrl}
                onIncreaseQuantity={() => handleIncreaseQuantity(item.id)}
                onDecreaseQuantity={() => handleDecreaseQuantity(item.id)}
                onRemove={() => removeItem(item.id)}
              />
            ))
          )}
        </div>

        {/* Cart Summary - Fixed at bottom */}
        {items.length > 0 && (
          <div className="border-t border-default-200 pt-4 pb-4 px-4 bg-white space-y-3">
            <CartSummary
              totalProducts={totalProducts}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
            <Button
              className="w-full bg-primary-600 text-white font-semibold rounded-lg py-6 text-base"
              onPress={() => {
                closeCart();
                router.push('/customer/address');
              }}
            >
              Elegir dirección
            </Button>
          </div>
        )}
      </div>
    </BottomSheet>
  );
};

