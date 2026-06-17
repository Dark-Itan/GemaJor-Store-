import { ValidationError } from '../../shared/errors/ValidationError';

export class Email {
  private readonly value: string;
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(value: string) {
    if (!value || !Email.EMAIL_REGEX.test(value)) {
      throw new ValidationError(
        'INVALID_EMAIL_FORMAT',
        'El correo que ingresaste no tiene un formato valido. Revisa que este completo, por ejemplo: nombre@correo.com',
        { email: value }
      );
    }
    this.value = value.toLowerCase().trim();
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}