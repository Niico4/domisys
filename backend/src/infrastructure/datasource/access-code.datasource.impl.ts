import { prisma } from '@/data/postgresql';
import { AccessCodeState } from '@/generated/enums';

import { AccessCodeDatasource } from '@/domain/datasources/access-code.datasource';
import { AccessCodeEntity } from '@/domain/entities/access-code.entity';

import { CreateCodeDtoType } from '@/domain/dtos/access-codes/create-code.dto';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

const userSelectBasic = {
  id: true,
  username: true,
  name: true,
  lastName: true,
} as const;

const withUserRelations = {
  userCreated: { select: userSelectBasic },
  userUsed: { select: userSelectBasic },
  userDisabled: { select: userSelectBasic },
} as const;

export const accessCodeDatasourceImplementation: AccessCodeDatasource = {
  async getAll(): Promise<AccessCodeEntity[]> {
    return await prisma.accessCode.findMany({
      orderBy: { createdAt: 'desc' },
      include: withUserRelations,
    });
  },

  async findById(id: number): Promise<AccessCodeEntity> {
    const accessCode = await prisma.accessCode.findUnique({
      where: { id },
      include: withUserRelations,
    });

    if (!accessCode) {
      throw new BadRequestException(messages.accessCode.notFound());
    }

    return accessCode;
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
    data: CreateCodeDtoType & { code: string; expiresAt: Date; adminId: number }
  ): Promise<AccessCodeEntity> {
    return await prisma.accessCode.create({
      data: {
        code: data.code,
        role: data.role,
        expiresAt: data.expiresAt,
        createdBy: data.adminId,
      },
      include: {
        userCreated: { select: userSelectBasic },
      },
    });
  },

  async updateState(
    id: number,
    state: AccessCodeState,
    expiresAt?: Date
  ): Promise<AccessCodeEntity> {
    return await prisma.accessCode.update({
      where: { id },
      data: {
        status: state,
        ...(expiresAt && { expiresAt }),
      },
    });
  },

  async markAsUsed(id: number, userId: number): Promise<AccessCodeEntity> {
    return await prisma.accessCode.update({
      where: { id },
      data: {
        status: AccessCodeState.used,
        usedBy: userId,
        usedAt: new Date(),
      },
    });
  },

  async disableCode(id: number, adminId: number): Promise<AccessCodeEntity> {
    return await prisma.accessCode.update({
      where: { id },
      data: {
        status: AccessCodeState.disabled,
        disabledBy: adminId,
        disabledAt: new Date(),
      },
      include: {
        userCreated: { select: userSelectBasic },
        userDisabled: { select: userSelectBasic },
      },
    });
  },
};
