import { z } from 'zod';

export const UpdateProviderDto = z
  .object({
    name: z
      .string()
      .min(3, 'El nombre debe tener mínimo 3 caracteres')
      .max(100, 'El nombre debe tener 100 caracteres o menos')
      .trim()
      .optional(),
    nit: z
      .string()
      .length(10, 'El NIT debe tener exactamente 10 dígitos')
      .regex(/^[0-9-]+$/, 'El NIT solo puede contener números y guiones')
      .trim()
      .optional(),
    email: z.email('Formato de correo electrónico inválido').trim().optional(),
    contactNumber: z
      .string()
      .regex(/^[0-9]{7,10}$/, 'Debe ser un número válido')
      .length(10, 'El número de contacto debe tener 10 dígitos')
      .trim()
      .optional(),
    address: z
      .string()
      .min(10, 'La dirección debe tener al menos 10 caracteres')
      .max(100, 'La dirección no puede tener más de 100 caracteres')
      .trim()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export type UpdateProviderDtoType = z.infer<typeof UpdateProviderDto>;
