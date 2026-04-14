import { Email } from '@core/domain/value-objects/email.vo';
import { PhoneNumber } from '@core/domain/value-objects/phone-number.vo';

import { ProviderEntity } from '../../domain/provider.entity';
import { Nit } from '../../domain/value-objects/nit.vo';
import { ProviderRepository } from '../../domain/provider.repository';

import { CreateProviderDtoType } from '../dtos/create-provider.dto';
import { BusinessRuleViolationError } from '@/core/domain/exceptions/business-rule-violated';

export interface CreateProviderUseCase {
  execute(dto: CreateProviderDtoType): Promise<ProviderEntity>;
}

export class CreateProvider implements CreateProviderUseCase {
  constructor(private readonly repository: ProviderRepository) {}

  async execute(dto: CreateProviderDtoType): Promise<ProviderEntity> {
    const nit = Nit.create(dto.nit, { allowWithoutDv: true });
    const email = Email.create(dto.email);
    const phoneNumber = PhoneNumber.create(dto.contactNumber);

    const existingProvider = await this.repository.findByNit(nit.getValue());
    if (existingProvider) {
      throw new BusinessRuleViolationError(
        'Provider with the same NIT already exists'
      );
    }

    const provider = ProviderEntity.create({
      name: dto.name,
      nit: nit,
      email: email,
      contactNumber: phoneNumber,
      address: dto.address,
    });

    return this.repository.create(provider);
  }
}
