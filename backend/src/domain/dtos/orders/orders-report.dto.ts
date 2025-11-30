import { OrderState } from '@/generated/enums';
import { z } from 'zod';

export const ordersReportDto = z.object({
  startDate: z.iso
    .datetime({ error: 'El formato de la fecha debe ser válido.' })
    .optional(),
  endDate: z.iso
    .datetime({ error: 'El formato de la fecha debe ser válido.' })
    .optional(),
  state: z
    .enum(OrderState, {
      error: 'El estado del pedido es obligatorio y debe ser válido.',
    })
    .optional(),
  customerId: z.coerce
    .number({ error: 'La categoría es obligatoria y debe ser un número.' })
    .int({ error: 'La categoría debe ser un número entero.' })
    .positive({ error: 'La categoría debe ser un ID válido.' })
    .optional(),

  deliveryId: z.coerce
    .number({ error: 'El proveedor es obligatorio y debe ser un número.' })
    .int({ error: 'El proveedor debe ser un número entero.' })
    .positive({ error: 'El proveedor debe ser un ID válido.' })
    .optional(),
});

export type OrdersReportDtoType = z.infer<typeof ordersReportDto>;
