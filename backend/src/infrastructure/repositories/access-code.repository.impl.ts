import { AccessCodeDatasource } from '@/domain/datasources/access-code.datasource';
import { CreateCodeDtoType } from '@/domain/dtos/access-codes/create-code.dto';
import { AccessCodeRepository } from '@/domain/repositories/access-code.repository';
import { AccessCodeState } from '@/generated/enums';

export const accessCodeRepositoryImplementation = (
  datasource: AccessCodeDatasource
): AccessCodeRepository => ({
  getAll: () => datasource.getAll(),
  findById: (id: number) => datasource.findById(id),
  findActiveByCode: (code: string) => datasource.findActiveByCode(code),

  createCode: (
    data: CreateCodeDtoType & { code: string; expiresAt: Date; adminId: number }
  ) => datasource.createCode(data),

  updateState: (id: number, state: AccessCodeState, expiresAt?: Date) =>
    datasource.updateState(id, state, expiresAt),

  markAsUsed: (id: number, userId: number) => datasource.markAsUsed(id, userId),
  disableCode: (id: number, adminId: number) =>
    datasource.disableCode(id, adminId),
});
