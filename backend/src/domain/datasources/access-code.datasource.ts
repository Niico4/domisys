import { AccessCodeState } from '@/generated/enums';

import { AccessCodeEntity } from '../entities/access-code.entity';
import { CreateCodeDtoType } from '../dtos/access-codes/create-code.dto';

export interface AccessCodeDatasource {
  getAll(): Promise<AccessCodeEntity[]>;
  findById(id: number): Promise<AccessCodeEntity>;
  findByCode(code: string): Promise<AccessCodeEntity | null>;
  findActiveByCode(code: string): Promise<AccessCodeEntity | null>;
  createCode(
    data: CreateCodeDtoType & { code: string; expiresAt: Date }
  ): Promise<AccessCodeEntity>;
  updateState(
    id: number,
    state: AccessCodeState,
    expiresAt?: Date
  ): Promise<AccessCodeEntity>;
  disableCode(id: number): Promise<AccessCodeEntity>;
}
