import { z } from 'zod';
import { ProductState } from '@/generated/enums';

export const inventoryReportDto = z.object({
  categoryId: z.coerce
    .number({ error: 'La categoría es obligatoria y debe ser un número.' })
    .int({ error: 'La categoría debe ser un número entero.' })
    .positive({ error: 'La categoría debe ser un ID válido.' })
    .optional(),

  providerId: z.coerce
    .number({ error: 'El proveedor es obligatorio y debe ser un número.' })
    .int({ error: 'El proveedor debe ser un número entero.' })
    .positive({ error: 'El proveedor debe ser un ID válido.' })
    .optional(),

  state: z
    .enum(ProductState, {
      error: 'El estado del producto es obligatorio y debe ser válido.',
    })
    .optional(),
});

export type ProductReportDtoType = z.infer<typeof inventoryReportDto>;
