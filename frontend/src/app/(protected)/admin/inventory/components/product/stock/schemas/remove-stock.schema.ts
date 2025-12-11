import { MovementReason } from '@/types/inventory/enums/movement-inventory';
import z from 'zod';

export const removeStockPayloadSchema = z.object({
  quantity: z
    .number({ error: 'La cantidad es obligatoria y debe ser un número.' })
    .int({ error: 'La cantidad debe ser un número entero.' })
    .positive({ error: 'La cantidad debe ser mayor a cero.' }),

  reason: z.enum(MovementReason, {
    error: 'El motivo de la salida es obligatorio y debe ser válido.',
  }),

  providerId: z
    .number({ error: 'El proveedor es obligatorio' })
    .int()
    .positive({ error: 'Debes seleccionar un proveedor válido' }),
});

export type RemoveStockPayloadType = z.infer<typeof removeStockPayloadSchema>;
