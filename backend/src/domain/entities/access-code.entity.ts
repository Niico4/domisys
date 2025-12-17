import { AccessCodeRole, AccessCodeState } from '@/generated/enums';

export class AccessCodeEntity {
  constructor(
    public readonly id: number,
    public readonly code: string,
    public readonly role: AccessCodeRole,
    public readonly status: AccessCodeState,
    public readonly expiresAt: Date,
    public readonly usedAt: Date | null,
    public readonly disabledAt: Date | null,
    public readonly createdAt: Date,

    public readonly createdBy: number,
    public readonly disabledBy: number | null,
    public readonly usedBy: number | null
  ) {}
}
