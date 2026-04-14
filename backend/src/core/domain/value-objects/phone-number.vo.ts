import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

import { InvalidValueError } from '../exceptions/invalid-value';
import { RequiredValueError } from '../exceptions/required-value';

const NON_DIGIT_REGEX = /\D/g;
const REPEATED_DIGITS_REGEX = /^(\d)\1+$/;
const CO_COUNTRY = 'CO';
const LOCAL_LENGTH = 10;

export class PhoneNumber {
  private constructor(private readonly value: string) {}

  public static create(raw: string): PhoneNumber {
    if (!raw) {
      throw new RequiredValueError('Phone number is required.');
    }

    const trimmed = raw.trim();
    const digits = trimmed.replace(NON_DIGIT_REGEX, '');

    if (digits.length !== LOCAL_LENGTH) {
      throw new InvalidValueError('Phone number must have exactly 10 digits.');
    }

    if (REPEATED_DIGITS_REGEX.test(digits)) {
      throw new InvalidValueError(
        'Phone number cannot be a repeated digit number.'
      );
    }

    if (!isValidPhoneNumber(trimmed, CO_COUNTRY)) {
      throw new InvalidValueError(
        'Phone number must be a valid Colombian phone number.'
      );
    }

    const parsed = parsePhoneNumberFromString(trimmed, CO_COUNTRY);

    if (!parsed) {
      throw new InvalidValueError(
        'Phone number could not be parsed correctly.'
      );
    }

    return new PhoneNumber(parsed.number);
  }

  public static recreate(value: string): PhoneNumber {
    if (!value) throw new RequiredValueError('Phone number is required.');
    return new PhoneNumber(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}
