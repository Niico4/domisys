import { z } from 'zod';

export const addressPayloadSchema = z.object({
  alias: z
    .string({ error: 'El alias es obligatorio.' })
    .trim()
    .min(1, { error: 'El alias es requerido.' })
    .max(100, { error: 'El alias no puede tener más de 100 caracteres.' }),

  city: z
    .string({ error: 'La ciudad es obligatoria.' })
    .trim()
    .min(1, { error: 'La ciudad es requerida.' })
    .max(50, { error: 'La ciudad no puede tener más de 50 caracteres.' }),

  neighborhood: z
    .string({ error: 'El barrio es obligatorio.' })
    .trim()
    .min(1, { error: 'El barrio es requerido.' })
    .max(50, { error: 'El barrio no puede tener más de 50 caracteres.' }),

  street: z
    .string({ error: 'La calle es obligatoria.' })
    .trim()
    .min(1, { error: 'La calle es requerida.' })
    .max(50, { error: 'La calle no puede tener más de 50 caracteres.' }),

  details: z
    .string()
    .trim()
    .max(255, { error: 'Los detalles no pueden tener más de 255 caracteres.' })
    .optional()
    .nullable(),

  isDefault: z.boolean(),
});

export type AddressPayloadType = z.infer<typeof addressPayloadSchema>;
