import { CustomerId } from '../value-objects/CustomerId';
import { Email } from '../value-objects/Email';
import { PhoneNumber } from '../value-objects/PhoneNumber';

export class Customer {
  private readonly _id: CustomerId;
  private _firstName: string;
  private _lastName: string;
  private _email: Email;
  private _passwordHash: string;
  private _phone: PhoneNumber;
  private readonly _createdAt: Date;

  private constructor(
    id: CustomerId,
    firstName: string,
    lastName: string,
    email: Email,
    passwordHash: string,
    phone: PhoneNumber,
    createdAt: Date
  ) {
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._passwordHash = passwordHash;
    this._phone = phone;
    this._createdAt = createdAt;
  }

  // Factory method para crear un nuevo cliente
  static create(
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string,
    phone?: string
  ): Customer {
    return new Customer(
      new CustomerId(),           // Genera UUID v4 automático
      firstName,
      lastName,
      new Email(email),           // Valida formato RN-C02
      passwordHash,
      new PhoneNumber(phone),
      new Date()
    );
  }

  // Factory method para reconstruir desde BD
  static fromPersistence(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string,
    phone: string | null,
    createdAt: Date
  ): Customer {
    return new Customer(
      new CustomerId(id),         // Usa ID existente
      firstName,
      lastName,
      new Email(email),
      passwordHash,
      new PhoneNumber(phone),
      createdAt
    );
  }

  // Getters (no setters - inmutabilidad controlada)
  get id(): CustomerId { return this._id; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get email(): Email { return this._email; }
  get passwordHash(): string { return this._passwordHash; }
  get phone(): PhoneNumber { return this._phone; }
  get createdAt(): Date { return this._createdAt; }

  // Métodos de actualización controlada (PATCH)
  updatePhone(phone: string): void {
    this._phone = new PhoneNumber(phone);
  }

  updateName(firstName: string, lastName: string): void {
    this._firstName = firstName;
    this._lastName = lastName;
  }
}