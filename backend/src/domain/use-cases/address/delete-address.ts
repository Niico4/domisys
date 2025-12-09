import { AddressRepository } from '@/domain/repositories/address.repository';

export class DeleteAddress {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(userId: number, addressId: number): Promise<void> {
    await this.addressRepository.delete(addressId, userId);
  }
}
