import { z } from 'zod';
import { AccessCodeRole } from '@/generated/enums';

export const createCodeDto = z.strictObject({
  role: z.enum(AccessCodeRole, {
    message: 'El rol del código es obligatorio y debe ser válido.',
  }),
});

export type CreateCodeDtoType = z.infer<typeof createCodeDto>;
