import { UserRole } from '@/generated/enums';

import { AddressRepository } from '@/domain/repositories/address.repository';
import { AddressEntity } from '@/domain/entities/address.entity';
import { CreateAddressDtoType } from '@/domain/dtos/address/create-address.dto';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';
import { AuthRepository } from '@/domain/repositories/auth.repository';

export class CreateAddress {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly authRepository: AuthRepository
  ) {}

  async execute(
    dto: CreateAddressDtoType,
    userId: number
  ): Promise<AddressEntity> {
    const user = await this.authRepository.findById(userId);

    // Solo clientes pueden tener muchas direcciones
    if (user.role !== UserRole.customer) {
      const addressCount = await this.addressRepository.countByUser(userId);

      if (addressCount >= 1) {
        throw new BadRequestException(messages.address.onlyCustomerMultiple());
      }
    }

    return await this.addressRepository.create(dto, userId);
  }
}
