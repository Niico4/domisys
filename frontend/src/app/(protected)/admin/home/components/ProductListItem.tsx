import { Chip } from '@heroui/react';
import type { Product } from '@/types/inventory/product';

interface ProductListItemProps {
  product: Product;
}

export const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg bg-default-100 p-4 transition-all hover:bg-default-200">
      <div className="flex-1">
        <p className="font-medium">{product.name}</p>
        <p className="text-xs text-default-500">
          Stock: {product.stock} {product.measure}
        </p>
      </div>
      <div className="space-y-1 text-right">
        <p className="font-semibold text-primary">${product.price}</p>
        <Chip
          size="sm"
          color={product.stock === 0 ? 'danger' : 'warning'}
          variant="flat"
        >
          {product.stock === 0 ? 'Sin stock' : 'Bajo stock'}
        </Chip>
      </div>
    </div>
  );
};
