import { z } from 'zod';

export const registerPayloadSchema = z
  .strictObject({
    username: z
      .string({ error: 'El nombre de usuario es obligatorio.' })
      .trim()
      .min(3, { error: 'El nombre de usuario debe tener mínimo 3 caracteres.' })
      .max(18, {
        error: 'El nombre de usuario puede tener máximo 18 caracteres.',
      })
      .regex(/^[a-zA-Z0-9_.]+$/, {
        error:
          'El nombre de usuario solo puede contener letras, números, puntos y guiones bajos',
      }),

    email: z
      .email({
        error:
          'El correo electrónico es obligatorio y debe tener un formato válido.',
      })
      .max(100, {
        error: 'El correo electrónico puede tener máximo 100 caracteres.',
      })
      .trim(),

    name: z
      .string({ error: 'El nombre es obligatorio.' })
      .trim()
      .min(3, { error: 'El nombre debe tener mínimo 3 caracteres.' })
      .max(50, { error: 'El nombre puede tener máximo 50 caracteres.' })
      .regex(/^[a-zA-Z\sáÁéÉíÍóÓúÚ]+$/, {
        error: 'El nombre solo puede contener letras y espacios.',
      }),

    lastName: z
      .string({ error: 'El apellido es obligatorio.' })
      .trim()
      .min(3, { error: 'El apellido debe tener mínimo 3 caracteres.' })
      .max(50, { error: 'El apellido puede tener máximo 50 caracteres.' })
      .regex(/^[a-zA-Z\sáÁéÉíÍóÓúÚ]+$/, {
        error: 'El apellido solo puede contener letras y espacios.',
      }),

    phoneNumber: z
      .string({ error: 'El número de teléfono es obligatorio.' })
      .trim()
      .regex(/^[0-9]{10}$/, {
        error: 'El número de teléfono debe tener exactamente 10 dígitos.',
      }),

    password: z
      .string({ error: 'La contraseña es obligatoria.' })
      .min(8, { error: 'La contraseña debe tener mínimo 8 caracteres.' })
      .max(20, { error: 'La contraseña puede tener máximo 20 caracteres.' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        error:
          'La contraseña debe contener al menos una mayúscula, una minúscula y un número.',
      })
      .trim(),

    confirmPassword: z
      .string({
        error: 'La confirmación de la contraseña es obligatoria.',
      })
      .trim(),

    accessCode: z
      .string()
      .regex(/^[0-9]{8}$/, {
        error: 'El código de acceso debe tener exactamente 8 dígitos.',
      })
      .trim()
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export type RegisterPayloadType = z.infer<typeof registerPayloadSchema>;
