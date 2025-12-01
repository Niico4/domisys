import { z } from 'zod';

export const createProviderDto = z.strictObject({
  name: z
    .string({ error: 'El nombre debe ser un texto válido.' })
    .trim()
    .min(3, { error: 'El nombre debe tener mínimo 3 caracteres.' })
    .regex(
      /[a-zA-ZáéíóúñÁÉÍÓÚÑ]/,
      'El nombre debe contener letras, no solo números'
    )
    .max(100, { error: 'El nombre puede tener máximo 100 caracteres.' }),
  nit: z
    .string({ error: 'El NIT debe ser un texto válido.' })
    .regex(/^[0-9]{10}$/, {
      error: 'El NIT debe tener exactamente 10 dígitos.',
    })
    .trim(),
  email: z
    .email({
      error:
        'El correo electrónico es obligatorio y debe tener un formato válido.',
    })
    .trim(),
  contactNumber: z
    .string({ error: 'El número de contacto debe ser un texto válido.' })
    .regex(/^[0-9]{10}$/, {
      error: 'El número de contacto debe tener exactamente 10 dígitos.',
    })
    .trim(),
  address: z
    .string({ error: 'La dirección debe ser un texto válido.' })
    .trim()
    .min(10, { error: 'La dirección debe tener mínimo 10 caracteres.' })
    .max(100, { error: 'La dirección puede tener máximo 100 caracteres.' }),
});
export type CreateProviderDtoType = z.infer<typeof createProviderDto>;
