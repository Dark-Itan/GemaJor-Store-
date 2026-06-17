import { DomainError } from './DomainError';

export class UnauthorizedError extends DomainError {
  constructor() {
    super(
      'UNAUTHORIZED',
      'Necesitas iniciar sesion para realizar esta accion. Tu sesion puede haber expirado.',
      {}
    );
  }
}