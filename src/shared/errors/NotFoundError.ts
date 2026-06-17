import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(resource: string, details: Record<string, unknown> = {}) {
    super(
      `${resource}_NOT_FOUND`,
      `No encontramos este ${resource.toLowerCase()}. Puede que haya sido eliminado o el enlace este equivocado.`,
      details
    );
  }
}