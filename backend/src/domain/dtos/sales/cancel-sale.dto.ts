import { z } from 'zod';

export const cancelSaleDto = z.object({
  cashierId: z.coerce
    .number({ error: 'El ID del cajero debe ser un número.' })
    .int({ error: 'El ID del cajero debe ser un número entero.' })
    .positive({ error: 'El ID del cajero debe ser un ID válido.' }),
});

export type CancelSaleDtoType = z.infer<typeof cancelSaleDto>;
