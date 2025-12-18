import { z } from 'zod';

export const createCategoryDto = z
  .object({
    name: z
      .string({ error: 'El nombre debe ser un texto válido.' })
      .min(3, {
        error: 'El nombre de la categoría debe tener mínimo 3 caracteres.',
      })
      .max(50, {
        error: 'El nombre de la categoría no puede tener más de 50 caracteres.',
      })
      .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, 'El nombre no puede contener números'),

    description: z
      .string({ error: 'La descripción debe ser un texto válido.' })
      .max(255, {
        error: 'La descripción no puede tener más de 255 caracteres.',
      })
      .trim()
      .optional(),
  })
  .strict();

export type CreateCategoryDtoType = z.infer<typeof createCategoryDto>;
