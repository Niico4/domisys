import { BusinessRuleViolationError } from '@core/domain/exceptions/business-rule-violated';
import { InvalidValueError } from '@core/domain/exceptions/invalid-value';
import { RequiredValueError } from '@core/domain/exceptions/required-value';

const ONLY_DIGITS_REGEX = /^\d+$/;
const NIT_WITH_DV_REGEX = /^(\d+)-?(\d)$/;
const REPEATED_DIGITS_REGEX = /^(\d)\1+$/;

const BASE_MIN_LENGTH = 9;
const BASE_MAX_LENGTH = 10;

export class Nit {
  private constructor(private readonly value: string) {}

  public static create(
    nit: string,
    options?: { allowWithoutDv?: boolean }
  ): Nit {
    const allowWithoutDv = options?.allowWithoutDv ?? false;

    if (!nit) throw new RequiredValueError('NIT is required');

    const normalized = this.normalize(nit);

    if (allowWithoutDv && ONLY_DIGITS_REGEX.test(normalized)) {
      this.validateBase(normalized);
      return new Nit(normalized);
    }

    const { base, dv } = this.parse(normalized);

    this.validateBase(base);
    this.validateDv(base, dv);

    return new Nit(`${base}-${dv}`);
  }

  // Recreates a Nit without re-validating it (used when loading from persistence).
  public static recreate(value: string): Nit {
    if (!value) throw new RequiredValueError('NIT is required');
    return new Nit(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(otherNit: Nit): boolean {
    return this.value === otherNit.value;
  }

  public format(): string {
    const [base, dv] = this.value.split('-');
    if (!dv || !base) return this.value;

    const formattedBase = base.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedBase}-${dv}`;
  }

  private static normalize(raw: string): string {
    return raw.trim().replace(/[.\s]/g, '');
  }

  private static parse(value: string): { base: string; dv: number } {
    const match = NIT_WITH_DV_REGEX.exec(value);

    if (!match) throw new InvalidValueError('Invalid NIT format');

    const [, base, dvStr] = match;

    if (!base || !dvStr) {
      throw new InvalidValueError('Invalid NIT format');
    }

    return { base, dv: Number(dvStr) };
  }

  private static validateBase(base: string): void {
    if (base.length < BASE_MIN_LENGTH || base.length > BASE_MAX_LENGTH) {
      throw new InvalidValueError('Invalid NIT length');
    }

    if (REPEATED_DIGITS_REGEX.test(base)) {
      throw new BusinessRuleViolationError(
        'NIT cannot contain repeated digits only'
      );
    }
  }

  private static validateDv(base: string, dv: number): void {
    if (Number.isNaN(dv)) {
      throw new InvalidValueError('Invalid verification digit');
    }

    const expected = this.calculateDv(base);

    if (dv !== expected) {
      throw new InvalidValueError(
        `Invalid verification digit, expected ${expected}`
      );
    }
  }

  private static calculateDv(base: string): number {
    const weights = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3];

    if (base.length > weights.length) {
      throw new InvalidValueError('NIT too long');
    }

    const offset = weights.length - base.length;

    const sum = [...base].reduce((acc, ch, i) => {
      const digit = Number(ch);
      if (Number.isNaN(digit)) {
        throw new InvalidValueError('NIT must contain only digits');
      }

      const weight = weights[offset + i];
      if (weight === undefined) {
        throw new InvalidValueError('Invalid NIT length');
      }

      return acc + digit * weight;
    }, 0);

    const remainder = sum % 11;
    return remainder > 1 ? 11 - remainder : remainder;
  }
}
