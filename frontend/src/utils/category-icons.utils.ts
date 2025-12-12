import {
  IconWashMachine,
  IconCarrot,
  IconPackage,
  IconGlassFull,
  IconBread,
  IconCategory,
  IconMeat,
  IconFish,
  IconIceCream,
  IconCookie,
  IconPaw,
  IconDeviceGamepad,
  Icon,
} from '@tabler/icons-react';

/**
 * Maps keywords to their corresponding icons
 * The function checks if the category name contains any of these keywords
 */
const keywordIconMap: Array<{ keywords: string[]; icon: typeof IconWashMachine }> = [
  { keywords: ['aseo', 'limpieza', 'limpieza en casa', 'hogar', 'casa'], icon: IconWashMachine },
  { keywords: ['frutas', 'fruta', 'frutales'], icon: IconCarrot },
  { keywords: ['verduras', 'verdura', 'vegetales', 'vegetal'], icon: IconCarrot },
  { keywords: ['lácteos', 'lacteos', 'leche', 'queso', 'yogur', 'yogurt'], icon: IconPackage },
  { keywords: ['bebidas', 'bebida', 'refresco', 'jugo', 'jugos'], icon: IconGlassFull },
  { keywords: ['despensa', 'granos', 'arroz', 'pasta', 'fideos', 'comida', 'comidas'], icon: IconBread },
  { keywords: ['carnes', 'carne', 'pollo', 'res', 'cerdo'], icon: IconMeat },
  { keywords: ['pescado', 'pescados', 'mariscos', 'marisco'], icon: IconFish },
  { keywords: ['helados', 'helado', 'postres', 'postre'], icon: IconIceCream },
  { keywords: ['dulces', 'dulce', 'golosinas', 'chocolates', 'chocolate'], icon: IconCookie },
  { keywords: ['pan', 'panes', 'panadería', 'panaderia'], icon: IconBread },
  { keywords: ['mascota', 'mascotas', 'perro', 'gato', 'animal', 'animales', 'pet', 'pets'], icon: IconPaw },
  { keywords: ['entretenimiento', 'tecnología', 'tecnologia', 'tecnology', 'electronicos', 'electrónicos', 'dispositivos', 'juegos', 'videojuegos'], icon: IconDeviceGamepad },
];

/**
 * Gets the appropriate icon for a category based on its name
 * Checks if the category name (in lowercase) contains any keyword
 */
export const getCategoryIcon = (categoryName: string): typeof IconWashMachine => {
  const normalizedName = categoryName.toLowerCase().trim();
  
  // First, try exact match for backwards compatibility
  const exactMatch = keywordIconMap.find(({ keywords }) => 
    keywords.some(keyword => keyword === normalizedName)
  );
  if (exactMatch) {
    return exactMatch.icon;
  }
  
  // Then, check if the category name contains any keyword
  for (const { keywords, icon } of keywordIconMap) {
    if (keywords.some(keyword => normalizedName.includes(keyword))) {
      return icon;
    }
  }
  
  // Default icon if no match found
  return IconCategory;
};
