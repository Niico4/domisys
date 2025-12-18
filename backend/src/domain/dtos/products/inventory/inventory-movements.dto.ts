import { z } from 'zod';

export const inventoryMovementsDto = z.object({
  startDate: z.coerce
    .date({ message: 'El formato de la fecha debe ser válido.' })
    .optional(),
  endDate: z.coerce
    .date({ message: 'El formato de la fecha debe ser válido.' })
    .optional(),
  productId: z.coerce
    .number({
      error: 'El producto es obligatorio y debe ser un número.',
    })
    .int({ error: 'El producto debe ser un número entero.' })
    .positive({ error: 'El producto debe ser un ID válido.' })
    .optional(),
});

export type InventoryMovementsDtoType = z.infer<
  typeof inventoryMovementsDto
>;
