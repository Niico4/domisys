import { prisma } from '@/data/postgresql';
import { ProductState } from '@/generated/enums';
import { CreateCategoryDtoType } from '@/domain/dtos/categories/create-category.dto';
import { UpdateCategoryDtoType } from '@/domain/dtos/categories/update-category.dto';
import { CategoryReportDtoType } from '@/domain/dtos/categories/category-report.dto';
import { CategoryDatasource } from '@/domain/datasources/category.datasource';
import { CategoryEntity } from '@/domain/entities/category.entity';
import { CategoryReportEntity } from '@/domain/entities/category-report.entity';
import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export const categoryDatasourceImplementation: CategoryDatasource = {
  async getAll(): Promise<CategoryEntity[]> {
    return await prisma.category.findMany();
  },

  async findById(id: number): Promise<CategoryEntity> {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) throw new BadRequestException(messages.category.notFound());

    return category;
  },

  async create(data: CreateCategoryDtoType): Promise<CategoryEntity> {
    return await prisma.category.create({
      data: {
        ...data,
        description: data.description ?? null,
      },
    });
  },

  async update(
    id: number,
    data: UpdateCategoryDtoType
  ): Promise<CategoryEntity> {
    await this.findById(id);

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_key, value]) => value !== undefined)
    );

    return await prisma.category.update({
      where: { id },
      data: filteredData,
    });
  },

  async delete(id: number): Promise<CategoryEntity> {
    await this.findById(id);

    return await prisma.category.delete({ where: { id } });
  },

  async getCategoryReport(dto?: CategoryReportDtoType): Promise<CategoryReportEntity[]> {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            id: true,
            stock: true,
            price: true,
            state: true,
          },
        },
      },
    });

    const report = categories.map((category) => {
      const totalProducts = category.products.length;
      const activeProducts = category.products.filter(
        (p) => p.state === ProductState.active
      ).length;
      const inactiveProducts = totalProducts - activeProducts;
      
      const totalStock = category.products.reduce(
        (sum, p) => sum + p.stock,
        0
      );
      
      const totalValue = category.products.reduce(
        (sum, p) => sum + p.stock * Number(p.price),
        0
      );
      
      const lowStockProducts = category.products.filter(
        (p) => p.stock <= 50
      ).length;

      return new CategoryReportEntity(
        category.id,
        category.name,
        totalProducts,
        activeProducts,
        inactiveProducts,
        totalStock,
        totalValue,
        lowStockProducts
      );
    });

    let filtered = report;

    if (dto?.minProducts) {
      filtered = filtered.filter((r) => r.totalProducts >= dto.minProducts!);
    }

    if (!dto?.includeEmpty) {
      filtered = filtered.filter((r) => r.totalProducts > 0);
    }

    return filtered.sort((a, b) => b.totalProducts - a.totalProducts);
  },
};
