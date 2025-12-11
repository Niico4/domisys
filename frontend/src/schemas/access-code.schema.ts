import { z } from 'zod';
import { AccessCodeRole } from '@/types/user-management/access-code';

export const createAccessCodeSchema = z.object({
  role: z.enum(AccessCodeRole, {
    error: 'El rol es obligatorio y debe ser válido',
  }),
});

export type CreateAccessCodeFormData = z.infer<typeof createAccessCodeSchema>;
