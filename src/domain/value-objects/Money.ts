import { ValidationError } from '../../shared/errors/ValidationError';

export class Money {
  private readonly amount: number;

  constructor(amount: number) {
    if (amount <= 0) {
      throw new ValidationError(
        'INVALID_AMOUNT',
        'El monto del pago debe ser mayor a cero. Revisa la cantidad e intentalo de nuevo.',
        { amount }
      );
    }
    this.amount = Math.round(amount * 100) / 100;
  }

  toNumber(): number {
    return this.amount;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount;
  }
}