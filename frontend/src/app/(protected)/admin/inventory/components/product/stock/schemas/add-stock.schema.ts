import z from 'zod';

export const addStockPayloadSchema = z.object({
  quantity: z
    .number({ error: 'La cantidad debe ser un número' })
    .int({ error: 'La cantidad debe ser un número entero' })
    .positive({ error: 'La cantidad debe ser mayor a 0' }),
  providerId: z
    .number({ error: 'El proveedor es obligatorio' })
    .int()
    .positive({ error: 'Debes seleccionar un proveedor válido' }),
});

export type AddStockPayloadType = z.infer<typeof addStockPayloadSchema>;
