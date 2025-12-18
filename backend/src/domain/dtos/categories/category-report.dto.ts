import { z } from 'zod';

export const categoryReportDto = z.object({
  minProducts: z.coerce
    .number({ error: 'El mínimo de productos debe ser un número.' })
    .int()
    .nonnegative({ error: 'El mínimo de productos no puede ser negativo.' })
    .optional(),

  includeEmpty: z.coerce.boolean().optional().default(false),
});

export type CategoryReportDtoType = z.infer<typeof categoryReportDto>;
