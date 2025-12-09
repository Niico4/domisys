import { MovementReason } from '@/generated/enums';
import { z } from 'zod';

export const removeStockDto = z.object({
  quantity: z.coerce
    .number({ error: 'La cantidad es obligatoria y debe ser un número.' })
    .int({ error: 'La cantidad debe ser un número entero.' })
    .positive({ error: 'La cantidad debe ser mayor a cero.' }),

  reason: z.enum(MovementReason, {
    error: 'El motivo de la salida es obligatorio y debe ser válido.',
  }),
});

export type RemoveStockDtoType = z.infer<typeof removeStockDto>;
