import { z } from 'zod';

// Esquema común para contraseña reutilizable
const passwordSchema = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')
  .max(20, 'La contraseña no puede exceder los 20 caracteres')
  .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe incluir al menos una letra minúscula')
  .regex(/[0-9]/, 'Debe incluir al menos un número');

// Esquema para inicio de sesión
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Introduce un correo electrónico válido'),
  password: passwordSchema,
});

// Esquema para registro
export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(20, 'El nombre no puede tener más de 20 caracteres'),
    lastName: z
      .string()
      .min(3, 'El apellido debe tener al menos 3 caracteres')
      .max(20, 'El apellido no puede tener más de 20 caracteres'),
    email: z
      .string()
      .min(1, 'El correo electrónico es obligatorio')
      .email('Introduce un correo electrónico válido'),
    phoneNumber: z
      .string()
      .min(10, 'El número de teléfono debe tener al menos 10 caracteres')
      .max(15, 'El número de teléfono no puede tener más de 15 caracteres'),
    address: z
      .string()
      .min(10, 'La dirección debe tener al menos 10 caracteres')
      .max(50, 'La dirección no puede tener más de 50 caracteres'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Debes confirmar tu contraseña'),
    isDelivery: z.boolean(),
    invitationCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
  .superRefine((data, ctx) => {
    if (data.isDelivery) {
      if (!data.invitationCode?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El código de invitación es requerido para repartidores',
          path: ['invitationCode'],
        });
      } else if (data.invitationCode.length !== 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El código debe tener exactamente 8 caracteres',
          path: ['invitationCode'],
        });
      }
    }
  });

// Tipos TypeScript inferidos
export type SignInType = z.infer<typeof signInSchema>;
export type SignUpType = z.infer<typeof signUpSchema>;
