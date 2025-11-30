import { z } from 'zod';
import { OrderState } from '@/generated/enums';

export const updateOrderStateDto = z.object({
  state: z.enum(OrderState, {
    error: 'El estado del pedido es obligatorio y debe ser válido.',
  }),
});

export type UpdateOrderStateDtoType = z.infer<typeof updateOrderStateDto>;
