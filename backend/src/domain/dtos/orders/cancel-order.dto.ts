import z from 'zod';

export const CancelOrderDto = z.strictObject({
  cancellationReason: z
    .string({ error: 'La razón de cancelación debe ser una cadena de texto.' })
    .max(255, {
      error: 'La razón de cancelación no puede exceder los 255 caracteres.',
    })
    .trim()
    .optional(),
});

export type CancelOrderDtoType = z.infer<typeof CancelOrderDto>;
