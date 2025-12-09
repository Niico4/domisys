import { z } from 'zod';

export const changePasswordSchema = z.object({
  currentPassword: z.string('La contraseña actual es requerida'),
  newPassword: z
    .string({ error: 'La contraseña es obligatoria.' })
    .min(8, { error: 'La contraseña debe tener mínimo 8 caracteres.' })
    .max(20, { error: 'La contraseña puede tener máximo 20 caracteres.' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      error:
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número.',
    }),
});

export type ChangePasswordDtoType = z.infer<typeof changePasswordSchema>;
