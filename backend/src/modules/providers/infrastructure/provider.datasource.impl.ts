import { prisma } from '@data/postgresql';

import { ProviderEntity } from '../domain/provider.entity';
import { ProviderDatasource } from '../domain/provider.datasource';

export const providerDatasourceImplementation: ProviderDatasource = {
  async getAll(): Promise<ProviderEntity[]> {
    const providers = await prisma.provider.findMany();

    return providers.map((provider) => ProviderEntity.fromPrimitives(provider));
  },

  async findById(id: number): Promise<ProviderEntity | null> {
    const provider = await prisma.provider.findUnique({ where: { id } });

    if (!provider) return null;

    return ProviderEntity.fromPrimitives(provider);
  },

  async findByNit(nit: string): Promise<ProviderEntity | null> {
    const provider = await prisma.provider.findUnique({ where: { nit } });

    if (!provider) return null;

    return ProviderEntity.fromPrimitives(provider);
  },

  async create(provider: ProviderEntity): Promise<ProviderEntity> {
    const createdProvider = await prisma.provider.create({
      data: {
        name: provider.name,
        nit: provider.nit.getValue(),
        email: provider.email.getValue(),
        contactNumber: provider.contactNumber.getValue(),
        address: provider.address,
      },
    });

    return ProviderEntity.fromPrimitives(createdProvider);
  },

  async update(
    id: number,
    data: Partial<ProviderEntity>
  ): Promise<ProviderEntity> {
    const updatedProvider = await prisma.provider.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.nit && { nit: data.nit.getValue() }),
        ...(data.email && { email: data.email.getValue() }),
        ...(data.contactNumber && {
          contactNumber: data.contactNumber.getValue(),
        }),
        ...(data.address && { address: data.address }),
      },
    });

    return ProviderEntity.fromPrimitives(updatedProvider);
  },

  async delete(id: number): Promise<void> {
    await prisma.provider.delete({ where: { id } });
  },

  // async getProviderReport(
  //   dto?: ProviderReportDtoType
  // ): Promise<ProviderReportEntity[]> {
  //   const providers = await prisma.provider.findMany({
  //     include: {
  //       products: {
  //         select: {
  //           id: true,
  //           state: true,
  //         },
  //       },
  //       inventoryMovements: {
  //         select: {
  //           movementType: true,
  //           createdAt: true,
  //           quantity: true,
  //           product: {
  //             select: {
  //               price: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   const report = providers.map((provider) => {
  //     const totalProducts = provider.products.length;
  //     const activeProducts = provider.products.filter(
  //       (p) => p.state === ProductState.active
  //     ).length;

  //     const purchases = provider.inventoryMovements.filter(
  //       (m) => m.movementType === MovementType.in
  //     );

  //     const returns = provider.inventoryMovements.filter(
  //       (m) => m.movementType === MovementType.out
  //     );

  //     const totalPurchases = purchases.length;
  //     const totalReturns = returns.length;

  //     const totalSpent = purchases.reduce((sum, m) => {
  //       return sum + (m.quantity ?? 0) * Number(m.product.price);
  //     }, 0);

  //     return new ProviderReportEntity(
  //       provider.id,
  //       provider.name,
  //       provider.contactNumber,
  //       totalProducts,
  //       activeProducts,
  //       totalPurchases,
  //       totalReturns,
  //       totalSpent
  //     );
  //   });

  //   let filtered = report;

  //   if (dto?.minProducts) {
  //     filtered = filtered.filter((r) => r.totalProducts >= dto.minProducts!);
  //   }

  //   if (!dto?.includeEmpty) {
  //     filtered = filtered.filter((r) => r.totalProducts > 0);
  //   }

  //   return filtered.sort((a, b) => b.totalPurchases - a.totalPurchases);
  // },
};
