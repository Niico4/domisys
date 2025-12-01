import { SaleState } from '@/generated/enums';
import { z } from 'zod';

export const salesReportDto = z.object({
  startDate: z.iso
    .date({ error: 'El formato de la fecha debe ser válido.' })
    .optional(),
  endDate: z.iso
    .date({ error: 'El formato de la fecha debe ser válido.' })
    .optional(),
  state: z
    .enum(SaleState, {
      error: 'El estado del pedido es obligatorio y debe ser válido.',
    })
    .optional(),
  cashierId: z.coerce
    .number({ error: 'El ID del cajero es obligatorio y debe ser un número.' })
    .int({ error: 'El ID del cajero debe ser un número entero.' })
    .positive({ error: 'El ID del cajero debe ser un ID válido.' })
    .optional(),
});

export type SalesReportDtoType = z.infer<typeof salesReportDto>;
