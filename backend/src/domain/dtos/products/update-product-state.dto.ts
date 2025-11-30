import { ProductState } from '@/generated/enums';
import { z } from 'zod';

export const updateProductStateDto = z.object({
  state: z.enum(ProductState, {
    error: 'El estado del producto es obligatorio y debe ser válido.',
  }),
});

export type UpdateProductStateDtoType = z.infer<typeof updateProductStateDto>;
