import parsePhoneNumberFromString, {
  isValidPhoneNumber,
} from 'libphonenumber-js';
import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    name: z
      .string({ error: 'El nombre es obligatorio.' })
      .trim()
      .min(3, { error: 'El nombre debe tener mínimo 3 caracteres.' })
      .max(50, { error: 'El nombre puede tener máximo 50 caracteres.' })
      .regex(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+(\s[a-zA-ZáÁéÉíÍóÓúÚñÑ]+)*$/, {
        error: 'El nombre solo puede contener letras y espacios.',
      })
      .optional(),

    lastName: z
      .string({ error: 'El apellido es obligatorio.' })
      .trim()
      .min(3, { error: 'El apellido debe tener mínimo 3 caracteres.' })
      .max(50, { error: 'El apellido puede tener máximo 50 caracteres.' })
      .regex(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+(\s[a-zA-ZáÁéÉíÍóÓúÚñÑ]+)*$/, {
        error: 'El apellido solo puede contener letras y espacios.',
      })
      .optional(),
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
      })
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined && v !== null),
    {
      message: 'Debes enviar al menos un campo para actualizar.',
    }
  );

export type UpdateProfileDtoType = z.infer<typeof updateProfileSchema>;
