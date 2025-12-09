import { z } from 'zod';

export const updateAddressDto = z
  .object({
    alias: z.string().min(1, 'El alias es requerido').max(100).optional(),
    city: z.string().min(1, 'La ciudad es requerida').max(50).optional(),
    neighborhood: z.string().min(1, 'El barrio es requerido').max(50).optional(),
    street: z.string().min(1, 'La calle es requerida').max(50).optional(),
    details: z.string().optional().nullable(),
    isDefault: z.boolean().optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined && v !== null),
    {
      message: 'Debes enviar al menos un campo para actualizar.',
    }
  );

export type UpdateAddressDtoType = z.infer<typeof updateAddressDto>;
