/**
 * Returns a placeholder image URL if the provided image is null or empty
 */
export const getProductImage = (image: string | null | undefined): string => {
  if (image && image.trim() !== '') {
    return image;
  }
  // Placeholder image from Unsplash - generic product placeholder
  return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
};
