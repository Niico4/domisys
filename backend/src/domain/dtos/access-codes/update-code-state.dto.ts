import { z } from 'zod';
import { AccessCodeState } from '@/generated/enums';

export const updateCodeStateDto = z.object({
  status: z.enum(AccessCodeState, {
    error: 'El estado del código es obligatorio y debe ser válido.',
  }),
});

export type UpdateCodeStateDtoType = z.infer<typeof updateCodeStateDto>;
