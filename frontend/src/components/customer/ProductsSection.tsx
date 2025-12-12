'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { productService } from '@/services/product.service';
import { Product } from '@/types/inventory/product';
import {
  getProductImage,
  getProductImageWithUnsplash,
} from '@/utils/image.utils';

interface ProductWithImage extends Product {
  imageUrl?: string;
}

export const ProductsSection = () => {
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setImagesLoading(true);
      const data = await productService.getAllProducts();
      if (data) {
        // Filter only active products
        const activeProducts = data.filter(
          (product) => product.state === 'active'
        );
        setProducts(activeProducts);

        // Fetch images from Unsplash for products without images
        const productsWithImages = await Promise.all(
          activeProducts.map(async (product) => {
            const imageUrl = await getProductImageWithUnsplash(
              product.image,
              product.name
            );
            return {
              ...product,
              imageUrl,
            };
          })
        );
        setProducts(productsWithImages);
        setImagesLoading(false);
      }
      setIsLoading(false);
      setImagesLoading(false);
    };

    fetchProducts();
  }, []);

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
        {imagesLoading && products.length > 0
          ? // Show skeletons while images are loading
            products.map((product) => <ProductCardSkeleton key={product.id} />)
          : // Show actual product cards once images are loaded
            products.map((product) => {
              const price = Number(product.price) || 0;

              return (
                <ProductCard
                  key={product.id}
                  id={product.id.toString()}
                  name={product.name}
                  price={price}
                  unit={product.measure}
                  stock={product.stock ?? 0}
                  imageUrl={product.imageUrl || getProductImage(product.image)}
                />
              );
            })}
      </div>
    </section>
  );
};
