'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BannerImageProps {
  images: string[];
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export const BannerImage = ({
  images,
  alt,
  className = 'object-cover',
  sizes = '(max-width: 768px) 100vw, 1200px',
  priority = false,
}: BannerImageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  const handleError = () => {
    if (currentImageIndex < images.length - 1) {
      // Try the next fallback image
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      setImageKey((prev) => prev + 1); // Force re-render with new key
    } else {
      // All images failed, show error state
      setHasError(true);
    }
  };

  // Reset error state when image index changes
  useEffect(() => {
    setHasError(false);
  }, [currentImageIndex]);

  if (hasError || images.length === 0) {
    // Fallback to a gradient background if all images fail
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600" />
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <Image
      key={`${imageKey}-${currentImageIndex}`}
      src={currentImage}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority && currentImageIndex === 0}
      onError={handleError}
    />
  );
};
