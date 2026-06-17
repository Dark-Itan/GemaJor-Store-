import { ValidationError } from '../../shared/errors/ValidationError';
import { ConflictError } from '../../shared/errors/ConflictError';

export type PaymentStatusType = 'pending' | 'approved' | 'rejected' | 'refunded';

export class PaymentStatus {
  private static readonly VALID_STATUSES: PaymentStatusType[] = ['pending', 'approved', 'rejected', 'refunded'];
  private static readonly VALID_TRANSITIONS: Record<PaymentStatusType, PaymentStatusType[]> = {
    pending: ['approved', 'rejected'],
    approved: [],
    rejected: [],
    refunded: []
  };

  private readonly value: PaymentStatusType;

  constructor(value: string = 'pending') {
    if (!PaymentStatus.VALID_STATUSES.includes(value as PaymentStatusType)) {
      throw new ValidationError(
        'INVALID_PAYMENT_STATUS',
        `El estado ${value} no es valido. Estados permitidos: pending, approved, rejected, refunded`,
        { status: value }
      );
    }
    this.value = value as PaymentStatusType;
  }

  transitionTo(newStatus: PaymentStatusType): PaymentStatus {
    const allowed = PaymentStatus.VALID_TRANSITIONS[this.value];
    if (!allowed.includes(newStatus)) {
      throw new ConflictError(
        'INVALID_STATUS_TRANSITION',
        'No se puede cambiar el estado de este pago. Un pago aprobado o rechazado ya no puede modificarse.',
        { currentStatus: this.value, requestedStatus: newStatus }
      );
    }
    return new PaymentStatus(newStatus);
  }

  toString(): PaymentStatusType {
    return this.value;
  }
}