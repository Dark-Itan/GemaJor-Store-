import { ForbiddenError } from '../../../shared/errors/ForbiddenError';
import { AuthPayload } from './authMiddleware';

export function roleMiddleware(user: AuthPayload, allowedRoles: string[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError({
      userRole: user.role,
      requiredRoles: allowedRoles
    });
  }
}