import { Email } from '@core/domain/value-objects/email.vo';
import { PhoneNumber } from '@core/domain/value-objects/phone-number.vo';

import { Nit } from '../../domain/value-objects/nit.vo';
import { ProviderEntity } from '../../domain/provider.entity';
import { ProviderRepository } from '../../domain/provider.repository';

import { UpdateProviderDtoType } from '../dtos/update-provider.dto';
import { BusinessRuleViolationError } from '@/core/domain/exceptions/business-rule-violated';
import { BadRequestException } from '@/shared/exceptions/bad-request';

export interface UpdateProviderUseCase {
  execute(id: number, dto: UpdateProviderDtoType): Promise<ProviderEntity>;
}

export class UpdateProvider implements UpdateProviderUseCase {
  constructor(private readonly repository: ProviderRepository) {}

  async execute(
    id: number,
    dto: UpdateProviderDtoType
  ): Promise<ProviderEntity> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new BadRequestException('Provider not found');
    }

    if (dto.nit) {
      const nit = Nit.create(dto.nit, { allowWithoutDv: true });
      const nitExists = await this.repository.findByNit(nit.getValue());

      if (nitExists) {
        throw new BusinessRuleViolationError(
          'NIT already belongs to another provider'
        );
      }
    }

    const providerUpdated = existing.update({
      name: dto.name,
      nit: dto.nit ? Nit.create(dto.nit) : undefined,
      email: dto.email ? Email.create(dto.email) : undefined,
      contactNumber: dto.contactNumber
        ? PhoneNumber.create(dto.contactNumber)
        : undefined,
      address: dto.address,
    });

    return this.repository.update(id, providerUpdated);
  }
}
