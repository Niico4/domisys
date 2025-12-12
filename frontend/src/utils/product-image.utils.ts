/**
 * Utility functions for fetching product images from external APIs
 * Tries Unsplash first, then falls back to Pexels if Unsplash fails
 */

const UNSPLASH_API_URL = process.env.NEXT_PUBLIC_UNSPLASH_API_URL || 'https://api.unsplash.com/search/photos';
const UNSPLASH_CLIENT_ID = process.env.NEXT_PUBLIC_UNSPLASH_CLIENT_ID;
const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

// Cache to avoid multiple API calls for the same product
const imageCache = new Map<string, string>();

/**
 * Fetches an image from Unsplash based on a product query
 * @param query - The product name/query to search for
 * @returns Promise<string | null> - The image URL or null if not found
 */
async function getImageFromUnsplash(query: string): Promise<string | null> {
  if (!UNSPLASH_CLIENT_ID) {
    console.warn('Unsplash Client ID not configured, will try Pexels');
    return null;
  }

  try {
    const res = await fetch(
      `${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_CLIENT_ID}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      console.warn(`Unsplash API error for "${query}":`, res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    const imageUrl = data.results?.[0]?.urls?.regular || data.results?.[0]?.urls?.small || null;
    
    if (!imageUrl) {
      console.warn(`No image found in Unsplash results for "${query}"`);
    }
    
    return imageUrl;
  } catch (error) {
    console.warn(`Error fetching image from Unsplash for "${query}":`, error);
    return null;
  }
}

/**
 * Fetches an image from Pexels as a fallback
 * @param query - The product name/query to search for
 * @returns Promise<string | null> - The image URL or null if not found
 */
async function getImageFromPexels(query: string): Promise<string | null> {
  if (!PEXELS_API_KEY) {
    console.warn('Pexels API Key not configured');
    return null;
  }

  try {
    const res = await fetch(
      `${PEXELS_API_URL}?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      console.warn(`Pexels API error for "${query}":`, res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    const imageUrl = data.photos?.[0]?.src?.medium || data.photos?.[0]?.src?.small || null;
    
    if (!imageUrl) {
      console.warn(`No image found in Pexels results for "${query}"`);
    }
    
    return imageUrl;
  } catch (error) {
    console.warn(`Error fetching image from Pexels for "${query}":`, error);
    return null;
  }
}

/**
 * Gets an image URL for a product label, trying Unsplash first, then Pexels as fallback
 * @param label - The product name/label to search for
 * @returns Promise<string | null> - The image URL or null if not found
 */
export async function getImageForLabel(label: string): Promise<string | null> {
  // Check cache first
  const cacheKey = label.toLowerCase().trim();
  if (imageCache.has(cacheKey)) {
    const cached = imageCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }
  
  // Try Unsplash first
  let imageUrl = await getImageFromUnsplash(label);
  
  // If Unsplash fails, try Pexels as fallback
  if (!imageUrl) {
    imageUrl = await getImageFromPexels(label);
  }
  
  // Cache the result if found
  if (imageUrl) {
    imageCache.set(cacheKey, imageUrl);
  }
  
  return imageUrl;
}

/**
 * Clears the image cache
 */
export function clearImageCache(): void {
  imageCache.clear();
}
