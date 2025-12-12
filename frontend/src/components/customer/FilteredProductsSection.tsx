'use client';

import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { useCartStore } from '@/store/cart.store';
import { productService } from '@/services/product.service';
import { Product } from '@/types/inventory/product';
import { getProductImage, getProductImageWithUnsplash } from '@/utils/image.utils';

interface ProductWithImage extends Product {
  imageUrl?: string;
}

interface FilteredProductsSectionProps {
  searchQuery: string;
}

export const FilteredProductsSection = ({
  searchQuery,
}: FilteredProductsSectionProps) => {
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

  // Filter products based on search query (case-insensitive)
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    const query = searchQuery.toLowerCase().trim();
    return products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // Note: ProductCard now handles adding to cart internally
  // This callback is optional and can be used for tracking/analytics
  const handleAddToCart = (product: Product) => {
    // ProductCard already handles adding to cart, so we don't need to do it here
    // This is just a placeholder for future tracking/analytics if needed
  };

  if (isLoading) {
    return (
      <section className="w-full mt-8 sm:mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="col-span-full text-center text-default-500 text-sm py-8">
            Cargando productos...
          </div>
        </div>
      </section>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <section className="w-full mt-8 sm:mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="col-span-full text-center text-default-500 text-sm py-8">
            {searchQuery.trim()
              ? `No se encontraron productos para "${searchQuery}"`
              : 'No hay productos disponibles'}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mt-8 sm:mt-12">
      {searchQuery.trim() && (
        <h2 className="text-lg sm:text-xl font-semibold text-default-700 mb-4 sm:mb-6">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {imagesLoading && filteredProducts.length > 0 ? (
          // Show skeletons while images are loading
          filteredProducts.map((product) => (
            <ProductCardSkeleton key={product.id} />
          ))
        ) : (
          // Show actual product cards once images are loaded
          filteredProducts.map((product) => {
            // Convert price to number if it's a string
            const price =
              typeof product.price === 'string'
                ? parseFloat(product.price)
                : product.price;

            return (
              <ProductCard
                key={product.id}
                id={product.id.toString()}
                name={product.name}
                price={price}
                unit={product.measure}
                imageUrl={product.imageUrl || getProductImage(product.image)}
                onAddToCart={() => handleAddToCart(product)}
              />
            );
          })
        )}
      </div>
    </section>
  );
};
