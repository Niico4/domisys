import { z } from 'zod';

export const createAddressDto = z.strictObject({
  alias: z
    .string({ error: 'El alias es requerido' })
    .min(3, {
      error: 'El alias debe tener al menos 3 caracteres',
    })
    .max(100, {
      error: 'El alias no debe exceder los 100 caracteres',
    })
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/,
      'El alias solo puede contener letras, números y espacios'
    ),

  city: z
    .string({
      error: 'La ciudad es requerida',
    })
    .min(3, {
      error: 'La ciudad debe tener al menos 3 caracteres',
    })
    .max(50, {
      error: 'La ciudad no debe exceder los 50 caracteres',
    })
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]+$/,
      'La ciudad solo puede contener letras y espacios'
    ),

  neighborhood: z
    .string({
      error: 'El barrio es requerido',
    })
    .min(3, {
      error: 'El barrio debe tener al menos 3 caracteres',
    })
    .max(50, {
      error: 'El barrio no debe exceder los 50 caracteres',
    })
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/,
      'El barrio solo puede contener letras, números y espacios'
    ),

  street: z
    .string({
      error: 'La calle es requerida',
    })
    .min(3, {
      error: 'La calle debe tener al menos 3 caracteres',
    })
    .max(100, {
      error: 'La calle no debe exceder los 100 caracteres',
    })
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#.,\-\/]+$/,
      'La calle contiene caracteres no permitidos'
    ),

  details: z.string().optional(),

  isDefault: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (val === undefined) return false;
      if (typeof val === 'boolean') return val;
      return val === 'true';
    }),
});

export type CreateAddressDtoType = z.infer<typeof createAddressDto>;
