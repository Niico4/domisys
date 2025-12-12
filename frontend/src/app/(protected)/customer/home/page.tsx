"use client";

import { Avatar, Card, CardBody } from "@heroui/react";
import { Greeting } from "@/components/customer/Greeting";
import { SearchBar } from "@/components/shared/SearchBar";
import { NotificationButton } from "@/components/shared/NotificationButton";
import { FilterButton } from "@/components/shared/FilterButton";
import { CategoriesSection } from "@/components/customer/CategoriesSection";
import { ProductsSection } from "@/components/customer/ProductsSection";
import { FilteredProductsSection } from "@/components/customer/FilteredProductsSection";
import { RecentSearches } from "@/components/customer/RecentSearches";
import { Carousel } from "@/components/shared/Carousel";
import { BannerImage } from "@/components/shared/BannerImage";
import { addRecentSearch } from "@/utils/search-storage.utils";
import { useState } from "react";

const CustomerHomePage = () => {
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

  const handleNotifications = () => {
    console.log("Opening notifications");
  };

  // Carousel items with Unsplash supermarket/product images as backgrounds and fallbacks
  const carouselItems = [
    {
      id: 1,
      content: (
        <Card className="w-full overflow-hidden relative h-48 sm:h-56">
          <div className="absolute inset-0 z-0">
            <BannerImage
              images={[
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop',
                'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=600&fit=crop',
                'https://images.unsplash.com/photo-1604719312566-8912e8297b6a?w=1200&h=600&fit=crop',
                'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
                'https://images.unsplash.com/photo-1604719312566-8912e8297b6a?w=1200&h=600&fit=crop',
              ]}
              alt="Supermarket offers banner"
              priority
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>
          <CardBody className="relative z-20 p-6 flex flex-col justify-center h-full text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">¡Ofertas Especiales!</h3>
            <p className="text-sm sm:text-base opacity-95">
              Descuentos increíbles en productos seleccionados
            </p>
          </CardBody>
        </Card>
      ),
    },
    {
      id: 2,
      content: (
        <Card className="w-full overflow-hidden relative h-48 sm:h-56">
          <div className="absolute inset-0 z-0">
            <BannerImage
              images={[
                'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=600&fit=crop',
                'https://images.unsplash.com/photo-1604719312566-8912e8297b6a?w=1200&h=600&fit=crop',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop',
                'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
                'https://images.unsplash.com/photo-1604719312566-8912e8297b6a?w=1200&h=600&fit=crop',
              ]}
              alt="Free shipping banner"
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>
          <CardBody className="relative z-20 p-6 flex flex-col justify-center h-full text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Envío Gratis</h3>
            <p className="text-sm sm:text-base opacity-95">
              En compras superiores a $50.000
            </p>
          </CardBody>
        </Card>
      ),
    },
    {
      id: 3,
      content: (
        <Card className="w-full overflow-hidden relative h-48 sm:h-56">
          <div className="absolute inset-0 z-0">
            <BannerImage
              images={[
                'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
                'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=600&fit=crop',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop',
                'https://images.unsplash.com/photo-1604719312566-8912e8297b6a?w=1200&h=600&fit=crop',
                'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
              ]}
              alt="New products banner"
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>
          <CardBody className="relative z-20 p-6 flex flex-col justify-center h-full text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Nuevos Productos</h3>
            <p className="text-sm sm:text-base opacity-95">
              Descubre nuestra última selección
            </p>
          </CardBody>
        </Card>
      ),
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <Avatar
              size="md"
              className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
              color="default"
            />
            <div className="flex-1 min-w-0">
              <Greeting />
            </div>
          </div>

          <div className="flex-shrink-0">
            <NotificationButton onClick={handleNotifications} />
          </div>
        </header>

        {/* Carousel */}
        <Carousel items={carouselItems} className="mt-4" showArrows={false} />

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

        {activeSearch && (
          <RecentSearches
            onSearchClick={handleRecentSearchClick}
            refreshTrigger={refreshRecentSearches}
          />
        )}

        <main className="mt-6 sm:mt-8 space-y-8 sm:space-y-12">
          <CategoriesSection />
          {activeSearch ? (
            <FilteredProductsSection searchQuery={activeSearch} />
          ) : (
            <ProductsSection />
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerHomePage;
