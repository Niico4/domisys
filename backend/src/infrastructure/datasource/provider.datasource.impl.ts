import { prisma } from '@/data/postgresql';

import { CreateProviderDtoType } from '@/domain/dtos/providers/create-provider.dto';
import { UpdateProviderDtoType } from '@/domain/dtos/providers/update-provider.dto';
import { ProviderDatasource } from '@/domain/datasources/provider.datasource';
import { ProviderEntity } from '@/domain/entities/provider.entity';

export const providerDatasourceImplementation: ProviderDatasource = {
  async getAll(): Promise<ProviderEntity[]> {
    const providers = await prisma.provider.findMany();

    return providers;
  },

  async findById(id: number): Promise<ProviderEntity> {
    const provider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!provider) throw new Error(`No se encontró el proveedor ${id}`);

    return provider;
  },

  async create(
    createProviderDTO: CreateProviderDtoType
  ): Promise<ProviderEntity> {
    const newProvider = await prisma.provider.create({
      data: createProviderDTO,
    });

    return newProvider;
  },

  async delete(id: number): Promise<ProviderEntity> {
    await this.findById(id);

    const deletedProvider = await prisma.provider.delete({
      where: { id },
    });

    return deletedProvider;
  },

  async update(
    id: number,
    updateProviderDTO: UpdateProviderDtoType
  ): Promise<ProviderEntity> {
    await this.findById(id);

    const filteredData = Object.fromEntries(
      Object.entries(updateProviderDTO).filter(
        ([_key, value]) => value !== undefined
      )
    );

    const updatedProvider = await prisma.provider.update({
      where: { id },
      data: filteredData,
    });

    return updatedProvider;
  },
};
