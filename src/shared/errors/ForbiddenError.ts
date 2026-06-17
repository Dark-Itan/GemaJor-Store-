import { DomainError } from './DomainError';

export class ForbiddenError extends DomainError {
  constructor(details: Record<string, unknown> = {}) {
    super(
      'FORBIDDEN_ACCESS',
      'No tienes permiso para ver esta informacion. Si crees que es un error, contacta al administrador.',
      details
    );
  }
}