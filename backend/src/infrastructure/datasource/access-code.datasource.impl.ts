import { prisma } from '@/data/postgresql';
import { AccessCodeState } from '@/generated/enums';

import { AccessCodeDatasource } from '@/domain/datasources/access-code.datasource';
import { AccessCodeEntity } from '@/domain/entities/access-code.entity';

import { CreateCodeDtoType } from '@/domain/dtos/access-codes/create-code.dto';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export const accessCodeDatasourceImplementation: AccessCodeDatasource = {
  async getAll(): Promise<AccessCodeEntity[]> {
    return await prisma.accessCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: number): Promise<AccessCodeEntity> {
    const accessCode = await prisma.accessCode.findUnique({ where: { id } });

    if (!accessCode) {
      throw new BadRequestException(messages.accessCode.notFound());
    }

    return accessCode;
  },

  async findByCode(code: string): Promise<AccessCodeEntity | null> {
    return await prisma.accessCode.findUnique({ where: { code } });
  },

  async findActiveByCode(code: string): Promise<AccessCodeEntity | null> {
    return await prisma.accessCode.findFirst({
      where: {
        code,
        status: AccessCodeState.active,
      },
    });
  },

  async createCode(
    data: CreateCodeDtoType & { code: string; expiresAt: Date }
  ): Promise<AccessCodeEntity> {
    return await prisma.accessCode.create({
      data: {
        code: data.code,
        role: data.role,
        expiresAt: data.expiresAt,
        createdBy: data.createdBy,
      },
    });
  },

  async updateState(
    id: number,
    state: AccessCodeState,
    expiresAt?: Date
  ): Promise<AccessCodeEntity> {
    await this.findById(id);

    return await prisma.accessCode.update({
      where: { id },
      data: {
        status: state,
        ...(expiresAt && { expiresAt }),
      },
    });
  },

  async disableCode(id: number): Promise<AccessCodeEntity> {
    const code = await this.findById(id);

    if (code.status === AccessCodeState.disabled) {
      throw new BadRequestException(messages.accessCode.alreadyDisabled());
    }

    if (code.status !== AccessCodeState.active) {
      throw new BadRequestException(
        messages.accessCode.cannotDisableNonActive()
      );
    }

    return await prisma.accessCode.update({
      where: { id },
      data: {
        status: AccessCodeState.disabled,
        expiresAt: new Date(),
      },
    });
  },
};
