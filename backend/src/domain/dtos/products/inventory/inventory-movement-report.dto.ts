import { z } from 'zod';

export const inventoryMovementReportDto = z.object({
  startDate: z.iso
    .datetime({ error: 'El formato de la fecha debe ser válido.' })
    .optional(),
  endDate: z.iso
    .datetime({ error: 'El formato de la fecha debe ser válido.' })
    .optional(),
  productId: z.coerce
    .number({
      error: 'El producto es obligatorio y debe ser un número.',
    })
    .int({ error: 'El producto debe ser un número entero.' })
    .positive({ error: 'El producto debe ser un ID válido.' })
    .optional(),
});

export type InventoryMovementReportDtoType = z.infer<
  typeof inventoryMovementReportDto
>;
