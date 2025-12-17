import { AccessCodeState } from '@/generated/enums';

import { AccessCodeEntity } from '../entities/access-code.entity';
import { CreateCodeDtoType } from '../dtos/access-codes/create-code.dto';

export interface AccessCodeRepository {
  getAll(): Promise<AccessCodeEntity[]>;
  findById(id: number): Promise<AccessCodeEntity>;
  findActiveByCode(code: string): Promise<AccessCodeEntity | null>;

  createCode(
    data: CreateCodeDtoType & { code: string; expiresAt: Date; adminId: number }
  ): Promise<AccessCodeEntity>;
  updateState(
    id: number,
    state: AccessCodeState,
    expiresAt?: Date
  ): Promise<AccessCodeEntity>;
  markAsUsed(id: number, userId: number): Promise<AccessCodeEntity>;
  disableCode(id: number, adminId: number): Promise<AccessCodeEntity>;
}
