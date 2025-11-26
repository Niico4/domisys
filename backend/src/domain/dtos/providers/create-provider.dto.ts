import { z } from 'zod';

export const createProviderDto = z.object({
  name: z
    .string('El nombre es obligatorio')
    .min(3, 'El nombre debe tener mínimo 3 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .trim(),
  nit: z
    .string('El NIT es obligatorio')
    .length(10, 'El NIT debe tener exactamente 10 dígitos')
    .regex(/^[0-9-]+$/, 'El NIT solo puede contener números y guiones')
    .trim(),
  email: z.email('Formato de correo electrónico inválido').trim(),
  contactNumber: z
    .string('El número de contacto es obligatorio')
    .regex(/^[0-9]{7,10}$/, 'Debe ser un número válido')
    .length(10, 'El número de contacto debe tener 10 dígitos')
    .trim(),
  address: z
    .string('La dirección es obligatoria')
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(100, 'La dirección no puede tener más de 100 caracteres')
    .trim(),
});

export type CreateProviderDtoType = z.infer<typeof createProviderDto>;
