import parsePhoneNumberFromString, {
  isValidPhoneNumber,
} from 'libphonenumber-js';
import { z } from 'zod';

export const createProviderDto = z.strictObject({
  name: z
    .string({ error: 'El nombre debe ser un texto válido.' })
    .trim()
    .min(3, { error: 'El nombre debe tener mínimo 3 caracteres.' })
    .regex(
      /[a-zA-ZáéíóúñÁÉÍÓÚÑ]/,
      'El nombre debe contener letras, no solo números'
    )
    .max(100, { error: 'El nombre puede tener máximo 100 caracteres.' }),

  nit: z
    .string({ error: 'El NIT debe ser un texto válido.' })
    .regex(/^[0-9]{9,10}(-?[0-9])?$/, {
      error: 'El NIT debe tener entre 9 y 11 dígitos (puede incluir guión).',
    })
    .trim(),

  email: z
    .email({
      error:
        'El correo electrónico es obligatorio y debe tener un formato válido.',
    })
    .trim(),

  contactNumber: z
    .string({ error: 'El número de contacto es obligatorio.' })
    .length(10, {
      error: 'El número de contacto debe tener exactamente 10 dígitos.',
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
        error: 'El número de contacto debe ser un número válido de Colombia.',
      }
    )
    .refine(
      (phoneNumber) => {
        const digits = phoneNumber.replace(/\D/g, '');
        return !/^(\d)\1+$/.test(digits);
      },
      {
        error: 'El número de contacto debe ser un número válido.',
      }
    )
    .transform((phoneNumber) => {
      const parsed = parsePhoneNumberFromString(phoneNumber, 'CO');

      return String(parsed?.number);
    }),

  address: z
    .string({ error: 'La dirección debe ser un texto válido.' })
    .trim()
    .min(5, { error: 'La dirección debe tener mínimo 5 caracteres.' })
    .max(150, { error: 'La dirección puede tener máximo 150 caracteres.' }),
});
export type CreateProviderDtoType = z.infer<typeof createProviderDto>;
