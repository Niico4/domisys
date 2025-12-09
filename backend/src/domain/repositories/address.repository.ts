import { AddressEntity } from '@/domain/entities/address.entity';
import { CreateAddressDtoType } from '@/domain/dtos/address/create-address.dto';
import { UpdateAddressDtoType } from '@/domain/dtos/address/update-address.dto';

export interface AddressRepository {
  create(dto: CreateAddressDtoType, userId: number): Promise<AddressEntity>;
  findByUser(userId: number): Promise<AddressEntity[]>;
  findById(id: number, userId: number): Promise<AddressEntity | null>;
  update(
    id: number,
    dto: UpdateAddressDtoType,
    userId: number
  ): Promise<AddressEntity>;
  delete(id: number, userId: number): Promise<void>;
}
