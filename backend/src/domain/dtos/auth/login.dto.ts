import { z } from 'zod';

export const loginDto = z.strictObject({
  emailOrUsername: z
    .string({ error: 'El email o nombre de usuario es obligatorio.' })
    .min(3, { error: 'Debe tener mínimo 3 caracteres.' })
    .trim(),

  password: z
    .string({ error: 'La contraseña es obligatoria.' })
    .min(1, { error: 'La contraseña no puede estar vacía.' })
    .trim(),
});

export type LoginDtoType = z.infer<typeof loginDto>;
