import { InvalidValueError } from '../exceptions/invalid-value';
import { RequiredValueError } from '../exceptions/required-value';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(private readonly value: string) {}

  public static create(email: string): Email {
    if (!email) throw new RequiredValueError('Email is required');

    const normalized = email.trim().toLowerCase();

    if (!this.isValid(normalized)) {
      throw new InvalidValueError(`Invalid email format: ${email}`);
    }

    return new Email(normalized);
  }

  public static recreate(value: string): Email {
    if (!value) throw new RequiredValueError('Email is required');
    return new Email(value);
  }

  private static isValid(email: string): boolean {
    return EMAIL_REGEX.test(email);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}
