import { z } from 'zod';
import { ProductState } from '@/generated/enums';

export const productReportDto = z.object({
  categoryId: z.coerce
    .number({ error: 'La categoría debe ser un número.' })
    .int()
    .positive()
    .optional(),

  providerId: z.coerce
    .number({ error: 'El proveedor debe ser un número.' })
    .int()
    .positive()
    .optional(),

  state: z
    .enum(ProductState, {
      error: 'El estado del producto es obligatorio y debe ser válido.',
    })
    .optional(),
});

export type ProductReportDtoType = z.infer<typeof productReportDto>;
