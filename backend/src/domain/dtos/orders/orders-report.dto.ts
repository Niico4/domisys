import { OrderState } from '@/generated/enums';
import { z } from 'zod';

export const ordersReportDto = z.object({
  startDate: z.iso
    .date({ error: 'El formato de la fecha debe ser válido.' })
    .optional(),
  endDate: z.iso
    .date({ error: 'El formato de la fecha debe ser válido.' })
    .optional(),
  state: z
    .enum(OrderState, {
      error: 'El estado del pedido es obligatorio y debe ser válido.',
    })
    .optional(),
  customerId: z.coerce
    .number({ error: 'El ID del cliente debe ser un número.' })
    .int({ error: 'El ID del cliente debe ser un número entero.' })
    .positive({ error: 'El ID del cliente debe ser válido.' })
    .optional(),

  deliveryId: z.coerce
    .number({ error: 'El ID del repartidor debe ser un número.' })
    .int({ error: 'El ID del repartidor debe ser un número entero.' })
    .positive({ error: 'El ID del repartidor debe ser válido.' })
    .optional(),
});

export type OrdersReportDtoType = z.infer<typeof ordersReportDto>;
