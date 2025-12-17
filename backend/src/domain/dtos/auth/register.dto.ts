import parsePhoneNumberFromString, {
  isValidPhoneNumber,
} from 'libphonenumber-js';
import { z } from 'zod';

export const registerDto = z.strictObject({
  username: z
    .string({ error: 'El nombre de usuario es obligatorio.' })
    .trim()
    .min(3, { error: 'El nombre de usuario debe tener mínimo 3 caracteres.' })
    .max(30, {
      error: 'El nombre de usuario puede tener máximo 30 caracteres.',
    })
    .regex(/^[a-zA-Z0-9_.]+$/, {
      error:
        'El nombre de usuario solo puede contener letras, números, puntos, guiones bajos.',
    }),

  email: z
    .email({
      error:
        'El correo electrónico es obligatorio y debe tener un formato válido.',
    })
    .max(255, {
      error: 'El correo electrónico puede tener máximo 255 caracteres.',
    })
    .trim(),

  name: z
    .string({ error: 'El nombre es obligatorio.' })
    .trim()
    .min(3, { error: 'El nombre debe tener mínimo 3 caracteres.' })
    .max(50, { error: 'El nombre puede tener máximo 50 caracteres.' })
    .regex(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+(\s[a-zA-ZáÁéÉíÍóÓúÚñÑ]+)*$/, {
      error: 'El nombre solo puede contener letras y espacios.',
    }),

  lastName: z
    .string({ error: 'El apellido es obligatorio.' })
    .trim()
    .min(3, { error: 'El apellido debe tener mínimo 3 caracteres.' })
    .max(50, { error: 'El apellido puede tener máximo 50 caracteres.' })
    .regex(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+(\s[a-zA-ZáÁéÉíÍóÓúÚñÑ]+)*$/, {
      error: 'El apellido solo puede contener letras y espacios.',
    }),

  phoneNumber: z
    .string({ error: 'El número de teléfono es obligatorio.' })
    .length(10, {
      error: 'El número de teléfono debe tener exactamente 10 dígitos.',
    })
    .trim()
    .refine(
      (phoneNumber) => {
        try {
          return isValidPhoneNumber(phoneNumber, 'CO');
        } catch (error) {
          return false;
        }
      },
      {
        error: 'El número de teléfono debe ser un número válido de Colombia.',
      }
    )
    .refine(
      (phoneNumber) => {
        const digits = phoneNumber.replace(/\D/g, '');
        return !/^(\d)\1+$/.test(digits);
      },
      {
        error: 'El número de teléfono debe ser un número válido.',
      }
    )
    .transform((phoneNumber) => {
      const parsed = parsePhoneNumberFromString(phoneNumber, 'CO');

      return String(parsed?.number);
    }),

  password: z
    .string({ error: 'La contraseña es obligatoria.' })
    .min(8, { error: 'La contraseña debe tener mínimo 8 caracteres.' })
    .max(20, { error: 'La contraseña puede tener máximo 20 caracteres.' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      error:
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número.',
    }),

  accessCode: z
    .string()
    .regex(/^[0-9]{8}$/, {
      error: 'El código de acceso debe tener exactamente 8 dígitos.',
    })
    .trim()
    .optional(),
});

export type RegisterDtoType = z.infer<typeof registerDto>;
