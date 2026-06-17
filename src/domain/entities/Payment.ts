import { CustomerId } from '../value-objects/CustomerId';
import { Money } from '../value-objects/Money';
import { PaymentMethod, PaymentMethodType } from '../value-objects/PaymentMethod';
import { PaymentStatus, PaymentStatusType } from '../value-objects/PaymentStatus';

export class Payment {
  private readonly _id: string;
  private readonly _customerId: CustomerId;
  private readonly _amount: Money;
  private readonly _currency: string;
  private readonly _paymentMethod: PaymentMethod;
  private _status: PaymentStatus;
  private readonly _createdAt: Date;

  private constructor(
    id: string,
    customerId: CustomerId,
    amount: Money,
    currency: string,
    paymentMethod: PaymentMethod,
    status: PaymentStatus,
    createdAt: Date
  ) {
    this._id = id;
    this._customerId = customerId;
    this._amount = amount;
    this._currency = currency;
    this._paymentMethod = paymentMethod;
    this._status = status;
    this._createdAt = createdAt;
  }

  static create(
    customerId: string,
    amount: number,
    currency: string,
    paymentMethod: string
  ): Payment {
    const { v4: uuidv4 } = require('uuid');
    return new Payment(
      uuidv4(),
      new CustomerId(customerId),
      new Money(amount),
      currency,
      new PaymentMethod(paymentMethod),
      new PaymentStatus('pending'),
      new Date()
    );
  }

  static fromPersistence(
    id: string,
    customerId: string,
    amount: number,
    currency: string,
    paymentMethod: PaymentMethodType,
    status: PaymentStatusType,
    createdAt: Date
  ): Payment {
    return new Payment(
      id,
      new CustomerId(customerId),
      new Money(amount),
      currency,
      new PaymentMethod(paymentMethod),
      new PaymentStatus(status),
      createdAt
    );
  }

  get id(): string { return this._id; }
  get customerId(): CustomerId { return this._customerId; }
  get amount(): Money { return this._amount; }
  get currency(): string { return this._currency; }
  get paymentMethod(): PaymentMethod { return this._paymentMethod; }
  get status(): PaymentStatus { return this._status; }
  get createdAt(): Date { return this._createdAt; }

  approve(): void {
    this._status = this._status.transitionTo('approved');
  }

  reject(): void {
    this._status = this._status.transitionTo('rejected');
  }

  refund(): void {
    this._status = this._status.transitionTo('refunded');
  }
}