import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class CustomerId {
  private readonly value: string;

  constructor(value?: string) {
    if (value && !uuidValidate(value)) {
      throw new Error('El ID del cliente debe ser un UUID v4 valido');
    }
    this.value = value || uuidv4();
  }

  toString(): string {
    return this.value;
  }

  equals(other: CustomerId): boolean {
    return this.value === other.value;
  }
}