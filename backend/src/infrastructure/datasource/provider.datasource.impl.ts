import { prisma } from '@/data/postgresql';
import { MovementType, ProductState } from '@/generated/enums';

import { ProviderEntity } from '@/domain/entities/provider.entity';
import { ProviderReportEntity } from '@/domain/entities/provider-report.entity';
import { ProviderDatasource } from '@/domain/datasources/provider.datasource';

import { CreateProviderDtoType } from '@/domain/dtos/providers/create-provider.dto';
import { UpdateProviderDtoType } from '@/domain/dtos/providers/update-provider.dto';
import { ProviderReportDtoType } from '@/domain/dtos/providers/provider-report.dto';
import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export const providerDatasourceImplementation: ProviderDatasource = {
  async getAll(): Promise<ProviderEntity[]> {
    return await prisma.provider.findMany();
  },

  async findById(id: number): Promise<ProviderEntity> {
    const provider = await prisma.provider.findUnique({ where: { id } });

    if (!provider) throw new BadRequestException(messages.provider.notFound());

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

  async getProviderReport(
    dto?: ProviderReportDtoType
  ): Promise<ProviderReportEntity[]> {
    const providers = await prisma.provider.findMany({
      include: {
        products: {
          select: {
            id: true,
            state: true,
          },
        },
        inventoryMovements: {
          select: {
            movementType: true,
            createdAt: true,
            quantity: true,
            product: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    });

    const report = providers.map((provider) => {
      const totalProducts = provider.products.length;
      const activeProducts = provider.products.filter(
        (p) => p.state === ProductState.active
      ).length;

      const purchases = provider.inventoryMovements.filter(
        (m) => m.movementType === MovementType.in
      );

      const returns = provider.inventoryMovements.filter(
        (m) => m.movementType === MovementType.out
      );

      const totalPurchases = purchases.length;
      const totalReturns = returns.length;

      const totalSpent = purchases.reduce((sum, m) => {
        return sum + (m.quantity ?? 0) * Number(m.product.price);
      }, 0);

      return new ProviderReportEntity(
        provider.id,
        provider.name,
        provider.contactNumber,
        totalProducts,
        activeProducts,
        totalPurchases,
        totalReturns,
        totalSpent
      );
    });

    let filtered = report;

    if (dto?.minProducts) {
      filtered = filtered.filter((r) => r.totalProducts >= dto.minProducts!);
    }

    if (!dto?.includeEmpty) {
      filtered = filtered.filter((r) => r.totalProducts > 0);
    }

    return filtered.sort((a, b) => b.totalPurchases - a.totalPurchases);
  },
};
