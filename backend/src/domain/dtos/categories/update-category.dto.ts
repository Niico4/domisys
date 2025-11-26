import { z } from 'zod';

export const updateCategoryDto = z.object({
  name: z
    .string()
    .min(5, 'El nombre de la categoría debe tener mínimo 5 caracteres')
    .max(30, 'El nombre de la categoría puede tener máximo 30 caracteres')
    .trim()
    .optional(),

  description: z
    .string()
    .max(255, 'La descripción no puede tener más de 255 caracteres')
    .trim()
    .optional(),
});

export type UpdateCategoryDtoType = z.infer<typeof updateCategoryDto>;
