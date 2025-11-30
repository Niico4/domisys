import { z } from 'zod';

export const cancelOrderDto = z.object({
  customerId: z.coerce
    .number({ error: 'El cliente es obligatorio y debe ser un número.' })
    .int({ error: 'El cliente debe ser un número entero.' })
    .positive({ error: 'El cliente debe ser un ID válido.' }),

  deliveryId: z.coerce
    .number({ error: 'El repartidor es obligatorio y debe ser un número.' })
    .int({ error: 'El repartidor debe ser un número entero.' })
    .positive({ error: 'El repartidor debe ser un ID válido.' }),
});

export type CancelOrderDtoType = z.infer<typeof cancelOrderDto>;
