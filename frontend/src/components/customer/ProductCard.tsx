'use client';

import { Button, Card, CardBody } from '@heroui/react';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import Image from 'next/image';
import { useCartStore } from '@/store/cart.store';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl?: string;
  onAddToCart?: () => void;
}

export const ProductCard = ({
  id,
  name,
  price,
  unit,
  imageUrl,
  onAddToCart,
}: ProductCardProps) => {
  const { addItem, updateQuantity } = useCartStore();
  
  // Subscribe to this specific item's quantity in the cart
  // Ensure quantity is always at least 1 if item exists in cart
  const quantity = useCartStore((state) => {
    const item = state.items.find((item) => item.id === id);
    if (item) {
      // If item exists, ensure quantity is at least 1
      return Math.max(1, item.quantity);
    }
    return 0;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      unit,
      imageUrl,
    });
    // Call optional callback if provided (for tracking/analytics, etc.)
    // but don't add to cart again as it's already handled above
    if (onAddToCart) {
      onAddToCart();
    }
  };

  const handleIncrease = () => {
    if (quantity === 0) {
      // Add item with quantity 1
      addItem({
        id,
        name,
        price,
        unit,
        imageUrl,
      });
    } else {
      updateQuantity(id, quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    } else if (quantity === 1) {
      updateQuantity(id, 0);
    }
  };

  return (
    <Card className="w-full bg-[#F9EFD8] shadow-sm hover:shadow-md transition-shadow">
      <CardBody className="p-0">
        {/* Image Container with Price Badge */}
        <div className="relative w-full aspect-square rounded-t-lg overflow-hidden bg-default-100">
          <Image
            src={imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          {/* Price Badge */}
          <div className="absolute bottom-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-lg font-semibold text-sm">
            {formatPrice(price)}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-default-900 text-base line-clamp-2">
            {name}
          </h3>
          <p className="text-sm text-default-500">{unit}</p>

          {/* Quantity Selector or Add to Cart Button */}
          {quantity > 0 ? (
            <div className="flex items-center justify-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm mt-2">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="min-w-unit-8 w-8 h-8"
                onPress={handleDecrease}
                aria-label="Disminuir cantidad"
              >
                <IconMinus size={18} className="text-default-600" stroke={2} />
              </Button>
              <span className="text-base font-semibold text-default-900 min-w-[32px] text-center">
                {quantity}
              </span>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="min-w-unit-8 w-8 h-8"
                onPress={handleIncrease}
                aria-label="Aumentar cantidad"
              >
                <IconPlus size={18} className="text-default-600" stroke={2} />
              </Button>
            </div>
          ) : (
            <Button
              className="w-full bg-secondary-600 text-white/80 font-medium rounded-lg mt-2"
              onPress={handleAddToCart}
            >
              Agregar al carrito
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
