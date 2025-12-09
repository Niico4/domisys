import { PaymentMethod } from '@/generated/enums';
import { z } from 'zod';

export const createSaleDto = z.strictObject({
  paymentMethod: z.enum(PaymentMethod, {
    error: 'El método de pago es obligatorio y debe ser válido.',
  }),

  products: z
    .array(
      z.strictObject({
        productId: z.coerce
          .number({
            error: 'El ID del producto es obligatorio y debe ser un número.',
          })
          .int({ error: 'El ID del producto debe ser un número entero.' })
          .positive({ error: 'El ID del producto debe ser un ID válido.' }),
        quantity: z.coerce
          .number({
            error: 'La cantidad es obligatoria y debe ser un número.',
          })
          .int({ error: 'La cantidad debe ser un número entero.' })
          .positive({ error: 'La cantidad debe ser mayor a cero.' }),
      })
    )
    .min(1, { message: 'Debe haber al menos un producto en el pedido.' }),
});

export type CreateSaleDtoType = z.infer<typeof createSaleDto>;
