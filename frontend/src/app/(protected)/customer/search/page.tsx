"use client";

import { useState } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterButton } from "@/components/shared/FilterButton";
import { CategoriesSection } from "@/components/customer/CategoriesSection";
import { RecentSearches } from "@/components/customer/RecentSearches";
import { FilteredProductsSection } from "@/components/customer/FilteredProductsSection";
import { addRecentSearch } from "@/utils/search-storage.utils";

export default function CustomerSearchPage() {
  const [searchValue, setSearchValue] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [refreshRecentSearches, setRefreshRecentSearches] = useState(0);

  const handleSearch = () => {
    if (searchValue.trim()) {
      addRecentSearch(searchValue.trim());
      setActiveSearch(searchValue.trim());
      setRefreshRecentSearches((prev) => prev + 1);
    } else {
      setActiveSearch("");
    }
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setSearchValue(searchTerm);
    setActiveSearch(searchTerm);
  };

  const handleFilter = () => {
    console.log("Opening filters");
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              placeholder="Buscar producto..."
            />
          </div>
          <div className="flex-shrink-0">
            <FilterButton onClick={handleFilter} />
          </div>
        </div>

        <RecentSearches
          onSearchClick={handleRecentSearchClick}
          refreshTrigger={refreshRecentSearches}
        />

        <CategoriesSection />

        <FilteredProductsSection searchQuery={activeSearch} />
      </div>
    </div>
  );
}
