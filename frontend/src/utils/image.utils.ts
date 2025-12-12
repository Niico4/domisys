import { getImageForLabel } from './product-image.utils';

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

/**
 * Gets a product image, fetching from Unsplash (with Pexels fallback) if the product doesn't have one
 * @param image - The existing product image URL
 * @param productName - The product name to search for
 * @returns Promise<string> - The image URL
 */
export const getProductImageWithUnsplash = async (
  image: string | null | undefined,
  productName: string
): Promise<string> => {
  // If product has an image, use it
  if (image && image.trim() !== '') {
    return image;
  }

  // Try to fetch from Unsplash (with Pexels fallback)
  const fetchedImage = await getImageForLabel(productName);
  if (fetchedImage) {
    return fetchedImage;
  }

  // Fallback to placeholder
  return 'https://img.freepik.com/vector-gratis/coleccion-bocadillos-dibujos-animados_52683-73165.jpg';
};
