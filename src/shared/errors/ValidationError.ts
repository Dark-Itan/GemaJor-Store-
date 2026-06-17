import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  constructor(code: string, message: string, details: Record<string, unknown> = {}) {
    super(code, message, details);
  }
}