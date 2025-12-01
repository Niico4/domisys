import { z } from 'zod';

export const updateCategoryDto = z
  .object({
    name: z
      .string({ error: 'El nombre debe ser un texto válido.' })
      .min(5, {
        error: 'El nombre de la categoría debe tener mínimo 5 caracteres.',
      })
      .max(30, {
        error: 'El nombre de la categoría no puede tener más de 30 caracteres.',
      })
      .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, 'El nombre no puede contener números')
      .optional(),

    description: z
      .string({ error: 'La descripción debe ser un texto válido.' })
      .min(5, { error: 'La descripción debe tener al menos 5 caracteres.' })
      .max(255, {
        error: 'La descripción no puede tener más de 255 caracteres.',
      })
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined && v !== null),
    {
      message: 'Debes enviar al menos un campo para actualizar.',
    }
  );

export type UpdateCategoryDtoType = z.infer<typeof updateCategoryDto>;
