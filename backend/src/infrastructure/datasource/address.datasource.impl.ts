import { prisma } from '@/data/postgresql';

import { AddressEntity } from '@/domain/entities/address.entity';
import { AddressDatasource } from '@/domain/datasources/address.datasource';

import { CreateAddressDtoType } from '@/domain/dtos/address/create-address.dto';
import { UpdateAddressDtoType } from '@/domain/dtos/address/update-address.dto';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export const addressDatasourceImplementation: AddressDatasource = {
  async create(
    dto: CreateAddressDtoType,
    userId: number
  ): Promise<AddressEntity> {
    return prisma.$transaction(async (tx) => {
      const addressCount = await tx.address.count({
        where: { userId },
      });

      const shouldBeDefault = addressCount === 0 || dto.isDefault;

      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          alias: dto.alias,
          city: dto.city,
          neighborhood: dto.neighborhood,
          street: dto.street,
          details: dto.details || null,
          isDefault: shouldBeDefault,
          userId,
        },
      });
    });
  },

  async countByUser(userId: number): Promise<number> {
    return prisma.address.count({
      where: { userId },
    });
  },

  async findByUser(userId: number): Promise<AddressEntity[]> {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  },

  async findById(id: number, userId: number): Promise<AddressEntity | null> {
    return prisma.address.findFirst({
      where: { id, userId },
    });
  },

  async update(
    id: number,
    dto: UpdateAddressDtoType,
    userId: number
  ): Promise<AddressEntity> {
    return prisma.$transaction(async (tx) => {
      const address = await tx.address.findFirst({
        where: { id, userId },
      });

      if (!address) {
        throw new BadRequestException(messages.address.notFound());
      }

      if (dto.isDefault) {
        await tx.address.updateMany({
          where: {
            userId,
            isDefault: true,
            id: { not: id },
          },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id },
        data: {
          alias: dto.alias ?? address.alias,
          city: dto.city ?? address.city,
          neighborhood: dto.neighborhood ?? address.neighborhood,
          street: dto.street ?? address.street,
          details: dto.details ?? address.details,
          isDefault: dto.isDefault ?? address.isDefault,
        },
      });
    });
  },

  async delete(id: number, userId: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const address = await tx.address.findFirst({
        where: { id, userId },
      });

      if (!address) {
        throw new BadRequestException(messages.address.notFound());
      }

      await tx.address.delete({
        where: { id },
      });

      if (address.isDefault) {
        const nextAddress = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: 'asc' },
        });

        if (nextAddress) {
          await tx.address.update({
            where: { id: nextAddress.id },
            data: { isDefault: true },
          });
        }
      }
    });
  },
};
