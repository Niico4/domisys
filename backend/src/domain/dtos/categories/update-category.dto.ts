import { z } from 'zod';

export const updateCategoryDto = z
  .object({
    name: z
      .string({ error: 'El nombre debe ser un texto válido.' })
      .min(3, {
        error: 'El nombre de la categoría debe tener mínimo 3 caracteres.',
      })
      .max(50, {
        error: 'El nombre de la categoría no puede tener más de 50 caracteres.',
      })
      .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, 'El nombre no puede contener números')
      .optional(),

    description: z
      .string({ error: 'La descripción debe ser un texto válido.' })
      .max(255, {
        error: 'La descripción no puede tener más de 255 caracteres.',
      })
      .trim()
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined && v !== null),
    {
      message: 'Debes enviar al menos un campo para actualizar.',
    }
  );

export type UpdateCategoryDtoType = z.infer<typeof updateCategoryDto>;
