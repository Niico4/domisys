import { AddressRepository } from '@/domain/repositories/address.repository';
import { AddressEntity } from '@/domain/entities/address.entity';

export class GetUserAddresses {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(userId: number): Promise<AddressEntity[]> {
    return await this.addressRepository.findByUser(userId);
  }
}
