import { ValidationError } from '../../shared/errors/ValidationError';

export type PaymentMethodType = 'card' | 'transfer' | 'cash';

export class PaymentMethod {
  private static readonly VALID_METHODS: PaymentMethodType[] = ['card', 'transfer', 'cash'];
  private readonly value: PaymentMethodType;

  constructor(value: string) {
    if (!PaymentMethod.VALID_METHODS.includes(value as PaymentMethodType)) {
      throw new ValidationError(
        'INVALID_PAYMENT_METHOD',
        'El metodo de pago que seleccionaste no esta disponible. Elige entre tarjeta, transferencia o efectivo.',
        { paymentMethod: value }
      );
    }
    this.value = value as PaymentMethodType;
  }

  toString(): PaymentMethodType {
    return this.value;
  }
}