import { z } from 'zod';

export const updateProviderDto = z
  .object({
    name: z
      .string({ error: 'El nombre debe ser un texto válido.' })
      .min(3, { error: 'El nombre debe tener mínimo 3 caracteres.' })
      .max(100, { error: 'El nombre puede tener máximo 100 caracteres.' })
      .optional(),

    nit: z
      .string({ error: 'El NIT debe ser un texto válido.' })
      .regex(/^[0-9]{10}$/, {
        error: 'El NIT debe tener exactamente 10 dígitos.',
      })
      .optional(),

    email: z
      .email({ error: 'Formato de correo electrónico inválido.' })
      .optional(),

    contactNumber: z
      .string({ error: 'El número de contacto debe ser un texto válido.' })
      .regex(/^[0-9]{10}$/, {
        error: 'El número de contacto debe tener exactamente 10 dígitos.',
      })
      .optional(),

    address: z
      .string({ error: 'La dirección debe ser un texto válido.' })
      .min(10, { error: 'La dirección debe tener mínimo 10 caracteres.' })
      .max(100, { error: 'La dirección puede tener máximo 100 caracteres.' })
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined && v !== null),
    {
      message: 'Debes enviar al menos un campo para actualizar.',
    }
  );

export type UpdateProviderDtoType = z.infer<typeof updateProviderDto>;
