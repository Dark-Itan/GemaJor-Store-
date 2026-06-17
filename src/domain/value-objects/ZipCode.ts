import { ValidationError } from '../../shared/errors/ValidationError';

export class ZipCode {
  private readonly value: string;
  private static readonly ZIPCODE_REGEX = /^\d{5}$/;

  constructor(value: string) {
    if (!value || !ZipCode.ZIPCODE_REGEX.test(value)) {
      throw new ValidationError(
        'INVALID_ZIP_CODE',
        'El codigo postal que ingresaste no es valido. Debe tener 5 digitos, por ejemplo: 29000',
        { zipCode: value }
      );
    }
    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}