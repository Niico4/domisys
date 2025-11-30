import { OrderState, PaymentMethod } from '@/generated/enums';
import z from 'zod';

export const createOrderDto = z.object({
  state: z.enum(OrderState, {
    error: 'El estado del pedido es obligatorio y debe ser válido.',
  }),

  paymentMethod: z.enum(PaymentMethod, {
    error: 'El método de pago es obligatorio y debe ser válido.',
  }),

  totalAmount: z.coerce
    .number({
      error: 'El total a pagar es obligatorio y debe ser un número.',
    })
    .nonnegative({ error: 'El total a pagar no puede ser negativo.' }),

  products: z
    .array(
      z.object({
        productId: z.coerce
          .number({
            error: 'El ID del producto es obligatorio y debe ser un número.',
          })
          .int({ error: 'El ID del producto debe ser un número entero.' })
          .positive({ error: 'El ID del producto debe ser un ID válido.' }),
        quantity: z.coerce
          .number({ error: 'La cantidad es obligatoria y debe ser un número.' })
          .int({ error: 'La cantidad debe ser un número entero.' })
          .positive({ error: 'La cantidad debe ser mayor a cero.' }),
        unitPrice: z.coerce
          .number({
            error: 'El precio unitario es obligatorio y debe ser un número.',
          })
          .nonnegative({ error: 'El precio unitario no puede ser negativo.' }),
      })
    )
    .min(1, { message: 'Debe haber al menos un producto en el pedido.' }),

  customerId: z.coerce
    .number({ error: 'El cliente es obligatorio y debe ser un número.' })
    .int({ error: 'El cliente debe ser un número entero.' })
    .positive({ error: 'El cliente debe ser un ID válido.' }),

  deliveryId: z.coerce
    .number({ error: 'El repartidor es obligatorio y debe ser un número.' })
    .int({ error: 'El repartidor debe ser un número entero.' })
    .positive({ error: 'El repartidor debe ser un ID válido.' }),
});

export type CreateOrderDtoType = z.infer<typeof createOrderDto>;
