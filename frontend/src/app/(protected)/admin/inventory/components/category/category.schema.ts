import z from 'zod';

export const categoryPayloadSchema = z.strictObject({
  name: z
    .string({ error: 'El nombre debe ser un texto válido.' })
    .min(5, {
      error: 'El nombre de la categoría debe tener mínimo 5 caracteres.',
    })
    .max(30, {
      error: 'El nombre de la categoría no puede tener más de 30 caracteres.',
    })
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, 'El nombre no puede contener números'),

  description: z
    .string()
    .min(5, { error: 'La descripción debe tener al menos 5 caracteres.' })
    .max(255, {
      error: 'La descripción no puede tener más de 255 caracteres.',
    })
    .optional()
    .or(z.literal('')),
});

export type CategoryPayloadType = z.infer<typeof categoryPayloadSchema>;
