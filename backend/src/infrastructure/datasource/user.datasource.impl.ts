import bcrypt from 'bcrypt';
import { prisma } from '@/data/postgresql';
import { UserRole } from '@/generated/enums';

import { UserRepository } from '@/domain/repositories/user.repository';
import { UserEntity } from '@/domain/entities/user.entity';

import { UpdateProfileDtoType } from '@/domain/dtos/user/update-profile.dto';
import { ChangePasswordDtoType } from '@/domain/dtos/user/change-password.dto';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export const userDatasourceImplementation: UserRepository = {
  async findById(id: number): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new BadRequestException(messages.user.notFound());
    }

    return user as UserEntity;
  },

  async findAllAdmins(): Promise<UserEntity[]> {
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: [UserRole.admin],
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admins as UserEntity[];
  },

  async findAllDeliveries(): Promise<UserEntity[]> {
    const deliveries = await prisma.user.findMany({
      where: {
        role: {
          in: [UserRole.delivery],
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return deliveries as UserEntity[];
  },

  async updateProfile(
    userId: number,
    dto: UpdateProfileDtoType
  ): Promise<UserEntity> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException(messages.user.notFound());
    }

    const hasChanges =
      (dto.name && dto.name !== user.name) ||
      (dto.lastName && dto.lastName !== user.lastName) ||
      (dto.phoneNumber && dto.phoneNumber !== user.phoneNumber);

    if (!hasChanges) {
      throw new BadRequestException(messages.user.noChangesDetected());
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name ?? user.name,
        lastName: dto.lastName ?? user.lastName,
        phoneNumber: dto.phoneNumber ?? user.phoneNumber,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser as UserEntity;
  },

  async changePassword(
    userId: number,
    dto: ChangePasswordDtoType
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException(messages.user.notFound());
    }

    const isValidPassword = await bcrypt.compare(
      dto.currentPassword,
      user.password
    );

    if (!isValidPassword) {
      throw new BadRequestException(messages.auth.invalidCurrentPassword());
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },

  async deleteAccount(userId: number): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException(messages.user.notFound());
    }

    await prisma.user.delete({ where: { id: userId } });
  },
};
