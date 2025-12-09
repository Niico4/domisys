import { AccessCodeDatasource } from '@/domain/datasources/access-code.datasource';
import { CreateCodeDtoType } from '@/domain/dtos/access-codes/create-code.dto';
import { AccessCodeRepository } from '@/domain/repositories/access-code.repository';
import { AccessCodeState } from '@/generated/enums';

export const accessCodeRepositoryImplementation = (
  datasource: AccessCodeDatasource
): AccessCodeRepository => ({
  getAll: () => datasource.getAll(),
  findById: (id: number) => datasource.findById(id),
  findByCode: (code: string) => datasource.findByCode(code),
  findActiveByCode: (code: string) => datasource.findActiveByCode(code),

  createCode: (data: CreateCodeDtoType & { code: string; expiresAt: Date }) =>
    datasource.createCode(data),

  updateState: (id: number, state: AccessCodeState, expiresAt?: Date) =>
    datasource.updateState(id, state, expiresAt),

  disableCode: (id: number) => datasource.disableCode(id),
});
