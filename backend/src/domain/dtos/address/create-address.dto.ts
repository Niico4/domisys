import { z } from 'zod';

export const createAddressDto = z.object({
  alias: z.string().min(1, 'El alias es requerido').max(100),
  city: z.string().min(1, 'La ciudad es requerida').max(50),
  neighborhood: z.string().min(1, 'El barrio es requerido').max(50),
  street: z.string().min(1, 'La calle es requerida').max(50),
  details: z.string().optional().nullable(),
  isDefault: z.boolean().optional().default(false),
});

export type CreateAddressDtoType = z.infer<typeof createAddressDto>;
