import { AddressRepository } from '@/domain/repositories/address.repository';
import { AddressEntity } from '@/domain/entities/address.entity';
import { CreateAddressDtoType } from '@/domain/dtos/address/create-address.dto';

export class CreateAddress {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(
    dto: CreateAddressDtoType,
    userId: number
  ): Promise<AddressEntity> {
    return await this.addressRepository.create(dto, userId);
  }
}
