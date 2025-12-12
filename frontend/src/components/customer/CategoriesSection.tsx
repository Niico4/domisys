'use client';

import { useEffect, useState } from 'react';
import { CategoryButton } from './CategoryButton';
import { categoryService } from '@/services/category.service';
import { Category } from '@/types/category';
import { getCategoryIcon } from '@/utils/category-icons.utils';

export const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const data = await categoryService.getAllCategories();
      if (data) {
        setCategories(data);
      }
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    // TODO: Implement category navigation
    console.log('Category clicked:', categoryId);
  };

  if (isLoading) {
    return (
      <section className="w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-primary-600 mb-4 sm:mb-6">
          Categorías
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 sm:gap-6">
          <div className="col-span-full text-default-500 text-sm text-center py-4">
            Cargando categorías...
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-primary-600 mb-4 sm:mb-6">
          Categorías
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 sm:gap-6">
          <div className="col-span-full text-default-500 text-sm text-center py-4">
            No hay categorías disponibles
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-primary-600 mb-4 sm:mb-6">
        Categorías
      </h2>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 sm:gap-6 justify-items-center">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.name);
          return (
            <CategoryButton
              key={category.id}
              icon={Icon}
              label={category.name}
              onClick={() => handleCategoryClick(category.id)}
            />
          );
        })}
      </div>
    </section>
  );
};
