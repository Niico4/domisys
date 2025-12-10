import { z } from 'zod';

export const loginPayloadSchema = z.strictObject({
  emailOrUsername: z
    .string({
      error:
        'El correo electrónico o nombre de usuario es obligatorio y debe ser válido.',
    })
    .min(3, { error: 'Debe tener mínimo 3 caracteres.' }),
  password: z
    .string({
      error: 'La contraseña es obligatoria',
    })
    .min(8, { error: 'La contraseña debe tener mínimo 8 caracteres.' })
    .max(20, { error: 'La contraseña puede tener máximo 20 caracteres.' }),
});

export type LoginPayloadType = z.infer<typeof loginPayloadSchema>;
