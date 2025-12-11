import { useMemo, useState, useCallback } from 'react';
import { Product } from '@/types/inventory/product';

export const useInventoryFilters = (products: Product[]) => {
  const [filterValue, setFilterValue] = useState('');
  const [stateFilter, setStateFilter] = useState<Set<string>>(new Set(['all']));
  const [categoryFilter, setCategoryFilter] = useState<Set<string>>(
    new Set(['all'])
  );
  const [providerFilter, setProviderFilter] = useState<Set<string>>(
    new Set(['all'])
  );
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filtered = [...products];

    if (hasSearchFilter) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (!stateFilter.has('all')) {
      filtered = filtered.filter((product) => stateFilter.has(product.state));
    }

    if (!categoryFilter.has('all')) {
      filtered = filtered.filter(
        (product) =>
          product.categoryId !== null &&
          categoryFilter.has(product.categoryId.toString())
      );
    }

    if (!providerFilter.has('all')) {
      filtered = filtered.filter(
        (product) =>
          product.providerId !== null &&
          providerFilter.has(product.providerId.toString())
      );
    }

    return filtered;
  }, [
    products,
    filterValue,
    stateFilter,
    categoryFilter,
    providerFilter,
    hasSearchFilter,
  ]);

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value || '');
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  return {
    filterValue,
    stateFilter,
    categoryFilter,
    providerFilter,
    page,
    filteredItems,
    setStateFilter,
    setCategoryFilter,
    setProviderFilter,
    setPage,
    onSearchChange,
    onClear,
  };
};
