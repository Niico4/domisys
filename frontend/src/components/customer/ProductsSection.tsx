'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { useCartStore } from '@/store/cart.store';
import { productService } from '@/services/product.service';
import { Product } from '@/types/inventory/product';
import { getProductImage } from '@/utils/image.utils';

export const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const data = await productService.getAllProducts();
      if (data) {
        // Filter only active products
        const activeProducts = data.filter(
          (product) => product.state === 'active'
        );
        setProducts(activeProducts);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  // Note: ProductCard now handles adding to cart internally
  // This callback is optional and can be used for tracking/analytics
  const handleAddToCart = (product: Product) => {
    // ProductCard already handles adding to cart, so we don't need to do it here
    // This is just a placeholder for future tracking/analytics if needed
  };

  if (isLoading) {
    return (
      <section className="w-full mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold text-primary-600 text-center mb-6 sm:mb-8">
          Lo que tenemos para ti
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="col-span-full text-center text-default-500 text-sm py-8">
            Cargando productos...
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="w-full mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold text-primary-600 text-center mb-6 sm:mb-8">
          Lo que tenemos para ti
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="col-span-full text-center text-default-500 text-sm py-8">
            No hay productos disponibles
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mt-8 sm:mt-12">
      <h2 className="text-xl sm:text-2xl font-bold text-primary-600 text-center mb-6 sm:mb-8">
        Lo que tenemos para ti
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => {
          // Convert price to number if it's a string
          const price = typeof product.price === 'string' 
            ? parseFloat(product.price) 
            : product.price;

          return (
            <ProductCard
              key={product.id}
              id={product.id.toString()}
              name={product.name}
              price={price}
              unit={product.measure}
              imageUrl={getProductImage(product.image)}
              onAddToCart={() => handleAddToCart(product)}
            />
          );
        })}
      </div>
    </section>
  );
};
