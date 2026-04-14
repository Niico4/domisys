import z from 'zod';

export const updateProviderDto = z.strictObject({
  name: z
    .string({ error: 'El nombre debe ser un texto válido.' })
    .trim()
    .min(3, { error: 'El nombre debe tener mínimo 3 caracteres.' })
    .regex(
      /[a-zA-ZáéíóúñÁÉÍÓÚÑ]/,
      'El nombre debe contener letras, no solo números'
    )
    .max(100, { error: 'El nombre puede tener máximo 100 caracteres.' })
    .optional(),

  nit: z
    .string({ error: 'El NIT debe ser un texto válido.' })
    .trim()
    .optional(),

  email: z
    .email({
      error:
        'El correo electrónico es obligatorio y debe tener un formato válido.',
    })
    .trim()
    .optional(),

  contactNumber: z
    .string({ error: 'El número de contacto es obligatorio.' })
    .trim()
    .optional(),
  address: z
    .string({ error: 'La dirección debe ser un texto válido.' })
    .trim()
    .min(5, { error: 'La dirección debe tener mínimo 5 caracteres.' })
    .max(150, { error: 'La dirección puede tener máximo 150 caracteres.' })
    .optional(),
});

export type UpdateProviderDtoType = z.infer<typeof updateProviderDto>;
