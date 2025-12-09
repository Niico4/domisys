import { AccessCodeRole, AccessCodeState } from '@/generated/enums';

export class AccessCodeEntity {
  constructor(
    public readonly id: number,
    public readonly code: string,
    public readonly role: AccessCodeRole,
    public readonly status: AccessCodeState,
    public readonly expiresAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly createdBy: number | null
  ) {}
}
