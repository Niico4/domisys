import { prisma } from '@/data/postgresql';
import { CreateCategoryDtoType } from '@/domain/dtos/categories/create-category.dto';
import { UpdateCategoryDtoType } from '@/domain/dtos/categories/update-category.dto';
import { CategoryDatasource } from '@/domain/datasources/category.datasource';
import { CategoryEntity } from '@/domain/entities/category.entity';
import { BadRequestException } from '@/shared/exceptions/bad-request';

export const categoryDatasourceImplementation: CategoryDatasource = {
  async getAll(): Promise<CategoryEntity[]> {
    return await prisma.category.findMany();
  },

  async findById(id: number): Promise<CategoryEntity> {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category)
      throw new BadRequestException('No se encontró la categoría.');

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
};
