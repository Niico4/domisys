import { Email } from '@core/domain/value-objects/email.vo';
import { PhoneNumber } from '@core/domain/value-objects/phone-number.vo';
import { Nit } from './value-objects/nit.vo';

type ProviderUpdateProps = {
  name?: string | undefined;
  nit?: Nit | undefined;
  email?: Email | undefined;
  contactNumber?: PhoneNumber | undefined;
  address?: string | undefined;
};

export class ProviderEntity {
  private constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly nit: Nit,
    public readonly email: Email,
    public readonly contactNumber: PhoneNumber,
    public readonly address: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(newProvider: {
    name: string;
    nit: Nit;
    email: Email;
    contactNumber: PhoneNumber;
    address: string;
  }): ProviderEntity {
    return new ProviderEntity(
      0, // temporal
      newProvider.name,
      newProvider.nit,
      newProvider.email,
      newProvider.contactNumber,
      newProvider.address,
      new Date(),
      new Date()
    );
  }

  update(changes: Partial<ProviderUpdateProps>): ProviderEntity {
    return new ProviderEntity(
      this.id,
      changes.name ?? this.name,
      changes.nit ?? this.nit,
      changes.email ?? this.email,
      changes.contactNumber ?? this.contactNumber,
      changes.address ?? this.address,
      this.createdAt,
      new Date()
    );
  }

  static fromPrimitives(data: {
    id: number;
    name: string;
    nit: string;
    email: string;
    contactNumber: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
  }): ProviderEntity {
    return new ProviderEntity(
      data.id,
      data.name,
      Nit.recreate(data.nit),
      Email.recreate(data.email),
      PhoneNumber.recreate(data.contactNumber),
      data.address,
      data.createdAt,
      data.updatedAt
    );
  }
}
