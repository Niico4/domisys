import { prisma } from '@/data/postgresql';
import { CreateProviderDtoType } from '@/domain/dtos/providers/create-provider.dto';
import { UpdateProviderDtoType } from '@/domain/dtos/providers/update-provider.dto';
import { ProviderDatasource } from '@/domain/datasources/provider.datasource';
import { ProviderEntity } from '@/domain/entities/provider.entity';
import { BadRequestException } from '@/shared/exceptions/bad-request';

export const providerDatasourceImplementation: ProviderDatasource = {
  async getAll(): Promise<ProviderEntity[]> {
    return await prisma.provider.findMany();
  },

  async findById(id: number): Promise<ProviderEntity> {
    const provider = await prisma.provider.findUnique({ where: { id } });

    if (!provider)
      throw new BadRequestException('No se encontró el proveedor.');

    return provider;
  },

  async create(data: CreateProviderDtoType): Promise<ProviderEntity> {
    return await prisma.provider.create({ data });
  },

  async update(
    id: number,
    data: UpdateProviderDtoType
  ): Promise<ProviderEntity> {
    await this.findById(id);

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_key, value]) => value !== undefined)
    );

    return await prisma.provider.update({
      where: { id },
      data: filteredData,
    });
  },

  async delete(id: number): Promise<ProviderEntity> {
    await this.findById(id);

    return await prisma.provider.delete({ where: { id } });
  },
};
