import { AddressDatasource } from '@/domain/datasources/address.datasource';
import { CreateAddressDtoType } from '@/domain/dtos/address/create-address.dto';
import { UpdateAddressDtoType } from '@/domain/dtos/address/update-address.dto';
import { AddressRepository } from '@/domain/repositories/address.repository';

export const addressRepositoryImplementation = (
  datasource: AddressDatasource
): AddressRepository => ({
  create: (dto: CreateAddressDtoType, userId: number) =>
    datasource.create(dto, userId),
  findByUser: (userId: number) => datasource.findByUser(userId),
  findById: (id: number, userId: number) => datasource.findById(id, userId),
  update: (id: number, dto: UpdateAddressDtoType, userId: number) =>
    datasource.update(id, dto, userId),
  delete: (id: number, userId: number) => datasource.delete(id, userId),
});
