import { UserRole } from '@/generated/enums';
import { z } from 'zod';

export const createCodeDto = z.strictObject({
  role: z.enum([UserRole.admin, UserRole.delivery, UserRole.cashier] as const, {
    message: 'El rol del código es obligatorio y debe ser válido.',
  }),
  createdBy: z.coerce
    .number({ message: 'El creador es obligatorio y debe ser un número.' })
    .int({ message: 'El creador debe ser un número entero.' })
    .positive({ message: 'El creador debe ser un ID válido.' }),
});

export type CreateCodeDtoType = z.infer<typeof createCodeDto>;
