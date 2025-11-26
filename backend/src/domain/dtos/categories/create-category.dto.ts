import { z } from 'zod';

export const createCategoryDto = z.object({
  name: z
    .string()
    .min(5, 'El nombre de la categoría debe tener mínimo 5 caracteres')
    .max(30, 'El nombre de la categoría puede tener máximo 30 caracteres')
    .trim(),
  description: z
    .string()
    .min(5, 'La descripción debe ser de al menos 5 caracteres')
    .max(255, 'La descripción no puede tener más de 255 caracteres')
    .trim()
    .optional(),
});

export type CreateCategoryDtoType = z.infer<typeof createCategoryDto>;
