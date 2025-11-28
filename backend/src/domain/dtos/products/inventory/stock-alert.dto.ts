import { z } from 'zod';

export const stockAlertDto = z.object({
  threshold: z.coerce
    .number({ error: 'El umbral es obligatorio y debe ser un número.' })
    .int({ error: 'El umbral debe ser un número entero.' })
    .positive({ error: 'El umbral debe ser mayor a cero.' })
    .optional(),
});

export type StockAlertDtoType = z.infer<typeof stockAlertDto>;
