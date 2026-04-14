import { DomainError } from './domain-error';

export class RequiredValueError extends DomainError {
  readonly code = 'REQUIRED_VALUE';
}
