import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, 'El nombre solo puede contener letras y espacios')
      .optional(),
    lastName: z
      .string()
      .regex(
        /^[a-zA-Z\s]+$/,
        'El apellido solo puede contener letras y espacios'
      )
      .optional(),
    phoneNumber: z
      .string()
      .regex(/^\+?[0-9]{7,15}$/, 'Formato de teléfono inválido')
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined && v !== null),
    {
      message: 'Debes enviar al menos un campo para actualizar.',
    }
  );

export type UpdateProfileDtoType = z.infer<typeof updateProfileSchema>;
