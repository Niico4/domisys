import { prisma } from '@/data/postgres';
import { CategoryDatasource } from '@/domain/datasources/category.datasource';
import { CreateCategoryDtoType } from '@/domain/dtos/categories/create-category.dto';
import { UpdateCategoryDtoType } from '@/domain/dtos/categories/update-category.dto';
import { CategoryEntity } from '@/domain/entities/category.entity';

export const categoryDatasourceImplementation: CategoryDatasource = {
  async getAll(): Promise<CategoryEntity[]> {
    const categories = await prisma.category.findMany();

    return categories;
  },

  async findById(id: number): Promise<CategoryEntity> {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) throw new Error(`No se encontró la categoría ${id}`);

    return category;
  },

  async create(
    createCategoryDTO: CreateCategoryDtoType
  ): Promise<CategoryEntity> {
    const createdCategory = await prisma.category.create({
      data: {
        ...createCategoryDTO,
        description: createCategoryDTO.description ?? null,
      },
    });

    return createdCategory;
  },

  async update(
    id: number,
    updateCategoryDTO: UpdateCategoryDtoType
  ): Promise<CategoryEntity> {
    await this.findById(id);

    const filteredData = Object.fromEntries(
      Object.entries(updateCategoryDTO).filter(
        ([_key, value]) => value !== undefined
      )
    );

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: filteredData,
    });

    return updatedCategory;
  },

  async delete(id: number): Promise<CategoryEntity> {
    await this.findById(id);

    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    return deletedCategory;
  },
};
