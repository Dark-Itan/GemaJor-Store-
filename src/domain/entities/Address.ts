import { CustomerId } from '../value-objects/CustomerId';
import { ZipCode } from '../value-objects/ZipCode';

export class Address {
  private readonly _id: string;
  private readonly _customerId: CustomerId;
  private _street: string;
  private _city: string;
  private _state: string;
  private _zipCode: ZipCode;
  private _country: string;
  private _isDefault: boolean;

  private constructor(
    id: string,
    customerId: CustomerId,
    street: string,
    city: string,
    state: string,
    zipCode: ZipCode,
    country: string,
    isDefault: boolean
  ) {
    this._id = id;
    this._customerId = customerId;
    this._street = street;
    this._city = city;
    this._state = state;
    this._zipCode = zipCode;
    this._country = country;
    this._isDefault = isDefault;
  }

  static create(
    customerId: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    isDefault: boolean = false
  ): Address {
    const { v4: uuidv4 } = require('uuid');
    return new Address(
      uuidv4(),
      new CustomerId(customerId),
      street,
      city,
      state,
      new ZipCode(zipCode),
      country,
      isDefault
    );
  }

  static fromPersistence(
    id: string,
    customerId: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    isDefault: boolean
  ): Address {
    return new Address(
      id,
      new CustomerId(customerId),
      street,
      city,
      state,
      new ZipCode(zipCode),
      country,
      isDefault
    );
  }

  get id(): string { return this._id; }
  get customerId(): CustomerId { return this._customerId; }
  get street(): string { return this._street; }
  get city(): string { return this._city; }
  get state(): string { return this._state; }
  get zipCode(): ZipCode { return this._zipCode; }
  get country(): string { return this._country; }
  get isDefault(): boolean { return this._isDefault; }

  setAsDefault(): void {
    this._isDefault = true;
  }

  unsetDefault(): void {
    this._isDefault = false;
  }
}