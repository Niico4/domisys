import { ProductState } from '@/types/inventory/enums/product-state';
import { z } from 'zod';

export const updateProductStateSchema = z.object({
  state: z.enum(ProductState, {
    error: 'El estado del producto es obligatorio y debe ser válido.',
  }),
});

export type UpdateProductStatePayloadType = z.infer<
  typeof updateProductStateSchema
>;
