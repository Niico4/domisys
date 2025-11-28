import { z } from 'zod';

export const addStockDto = z.object({
  quantity: z.coerce
    .number({ error: 'La cantidad es obligatoria y debe ser un número.' })
    .int({ error: 'La cantidad debe ser un número entero.' })
    .positive({ error: 'La cantidad debe ser mayor a cero.' }),

  providerId: z.coerce
    .number({ error: 'El proveedor es obligatorio y debe ser un número.' })
    .int({ error: 'El ID del proveedor debe ser un número entero.' })
    .positive({ error: 'El ID del proveedor debe ser válido.' }),

  adminId: z.coerce
    .number({ error: 'El administrador es obligatorio y debe ser un número.' })
    .int({ error: 'El ID del administrador debe ser un número entero.' })
    .positive({ error: 'El ID del administrador debe ser válido.' }),
});

export type AddStockDtoType = z.infer<typeof addStockDto>;
