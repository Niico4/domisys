import { z } from 'zod';
import { OrderState } from '@/generated/enums';

const allowedStates = [
  OrderState.pending,
  OrderState.confirmed,
  OrderState.shipped,
] as const;

export const updateOrderStateDto = z.object({
  state: z.enum(allowedStates, {
    error: 'El estado del pedido debe ser: pending, confirmed o shipped.',
  }),
});

export type UpdateOrderStateDtoType = z.infer<typeof updateOrderStateDto>;
