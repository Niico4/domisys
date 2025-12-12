import {
  IconWashMachine,
  IconCarrot,
  IconPackage,
  IconGlassFull,
  IconBread,
  IconCategory,
  Icon,
} from '@tabler/icons-react';

/**
 * Maps category names to their corresponding icons
 */
const categoryIconMap: Record<string, typeof IconWashMachine> = {
  aseo: IconWashMachine,
  frutas: IconCarrot,
  lácteos: IconPackage,
  lacteos: IconPackage,
  bebidas: IconGlassFull,
  despensa: IconBread,
};

/**
 * Gets the appropriate icon for a category based on its name
 */
export const getCategoryIcon = (categoryName: string): typeof IconWashMachine => {
  const normalizedName = categoryName.toLowerCase().trim();
  return categoryIconMap[normalizedName] || IconCategory;
};
