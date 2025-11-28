import { z } from 'zod';

export const inventoryMovementReportDto = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  productId: z.number().int().positive().optional(),
});

export type InventoryReportDtoType = z.infer<typeof inventoryMovementReportDto>;
