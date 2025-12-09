import { AddressRepository } from '@/domain/repositories/address.repository';
import { AddressEntity } from '@/domain/entities/address.entity';
import { UpdateAddressDtoType } from '@/domain/dtos/address/update-address.dto';

export class UpdateAddress {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(
    id: number,
    dto: UpdateAddressDtoType,
    userId: number
  ): Promise<AddressEntity> {
    return await this.addressRepository.update(id, dto, userId);
  }
}
