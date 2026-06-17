export class PhoneNumber {
  private readonly value: string | null;

  constructor(value?: string | null) {
    if (value) {
      this.value = value.trim();
    } else {
      this.value = null;
    }
  }

  toString(): string | null {
    return this.value;
  }
}