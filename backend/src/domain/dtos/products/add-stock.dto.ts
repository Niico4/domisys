import { z } from 'zod';

export const addStockDto = z.object({
  quantity: z.coerce
    .number({ error: 'La cantidad es obligatoria y debe ser un número.' })
    .int({ error: 'La cantidad debe ser un número entero.' })
    .positive({ error: 'La cantidad debe ser mayor a cero.' }),
});

export type AddStockDtoType = z.infer<typeof addStockDto>;
