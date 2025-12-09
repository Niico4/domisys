import { prisma } from '@/data/postgresql';
import { UserRole } from '@/generated/enums';

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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new BadRequestException(messages.user.notFound());
    }

    const userAddresses = await prisma.address.count({
      where: { userId },
    });

    if (user.role !== UserRole.customer && userAddresses >= 1) {
      throw new BadRequestException(messages.address.onlyCustomerMultiple());
    }

    if (dto.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        alias: dto.alias,
        city: dto.city,
        neighborhood: dto.neighborhood,
        street: dto.street,
        details: dto.details || null,
        isDefault: dto.isDefault || false,
        userId,
      },
    });

    return address;
  },

  async findByUser(userId: number): Promise<AddressEntity[]> {
    return await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  },

  async findById(id: number, userId: number): Promise<AddressEntity | null> {
    return await prisma.address.findFirst({
      where: { id, userId },
    });
  },

  async update(
    id: number,
    dto: UpdateAddressDtoType,
    userId: number
  ): Promise<AddressEntity> {
    const address = await this.findById(id, userId);

    if (!address) {
      throw new BadRequestException(messages.address.notFound());
    }

    if (dto.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const updateData: any = {};
    if (dto.alias !== undefined) updateData.alias = dto.alias;
    if (dto.city !== undefined) updateData.city = dto.city;
    if (dto.neighborhood !== undefined)
      updateData.neighborhood = dto.neighborhood;
    if (dto.street !== undefined) updateData.street = dto.street;
    if (dto.details !== undefined) updateData.details = dto.details;
    if (dto.isDefault !== undefined) updateData.isDefault = dto.isDefault;

    return await prisma.address.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id: number, userId: number): Promise<void> {
    const address = await this.findById(id, userId);

    if (!address) {
      throw new BadRequestException(messages.address.notFound());
    }

    await prisma.address.delete({
      where: { id },
    });
  },
};
