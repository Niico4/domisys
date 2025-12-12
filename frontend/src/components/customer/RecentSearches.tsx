'use client';

import { Chip } from '@heroui/react';
import { useEffect, useState } from 'react';
import { getRecentSearches } from '@/utils/search-storage.utils';

interface RecentSearchesProps {
  onSearchClick: (searchTerm: string) => void;
  refreshTrigger?: number;
}

export const RecentSearches = ({
  onSearchClick,
  refreshTrigger,
}: RecentSearchesProps) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [refreshTrigger]);

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <section className="w-full mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-bold text-primary-600 mb-3 sm:mb-4">
        Buscado recientemente
      </h2>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {recentSearches.map((searchTerm, index) => (
          <Chip
            key={`${searchTerm}-${index}`}
            variant="flat"
            className="bg-default-100 text-default-700 cursor-pointer hover:bg-default-200 transition-colors"
            onClick={() => onSearchClick(searchTerm)}
          >
            {searchTerm}
          </Chip>
        ))}
      </div>
    </section>
  );
};
