'use client';

import { Button, Card, CardBody } from '@heroui/react';
import { IconTrash, IconMinus, IconPlus } from '@tabler/icons-react';
import Image from 'next/image';

interface CartItemCardProps {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  imageUrl?: string;
  onIncreaseQuantity?: () => void;
  onDecreaseQuantity?: () => void;
  onRemove?: () => void;
}

export const CartItemCard = ({
  name,
  price,
  unit,
  quantity,
  imageUrl,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemove,
}: CartItemCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="w-full bg-[#E6F1FD] shadow-sm">
      <CardBody className="p-4">
        <div className="flex items-start gap-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-default-100">
            <Image
              src={imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'}
              alt={name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>

          {/* Product Info and Controls */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            {/* Top Row: Name and Remove Button */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-default-900 text-sm sm:text-base line-clamp-1">
                  {name}
                </h3>
                <p className="text-xs sm:text-sm text-default-500 mt-0.5">
                  {unit}
                </p>
              </div>
              <Button
                isIconOnly
                size="sm"
                className="bg-red-100 hover:bg-red-200 min-w-unit-8 w-8 h-8 flex-shrink-0"
                onPress={onRemove}
                aria-label="Eliminar producto"
              >
                <IconTrash size={16} className="text-red-600" stroke={2} />
              </Button>
            </div>

            {/* Bottom Row: Price and Quantity Selector */}
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-default-900 text-sm sm:text-base">
                {formatPrice(price)}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-sm">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="min-w-unit-6 w-6 h-6"
                  onPress={onDecreaseQuantity}
                  aria-label="Disminuir cantidad"
                >
                  <IconMinus size={16} className="text-default-600" stroke={2} />
                </Button>
                <span className="text-sm font-semibold text-default-900 min-w-[24px] text-center">
                  {quantity}
                </span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="min-w-unit-6 w-6 h-6"
                  onPress={onIncreaseQuantity}
                  aria-label="Aumentar cantidad"
                >
                  <IconPlus size={16} className="text-default-600" stroke={2} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
