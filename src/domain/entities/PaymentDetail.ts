export class PaymentDetail {
  private readonly _id: string;
  private readonly _paymentId: string;
  private readonly _receiptNumber: string;
  private _notes: string | null;
  private _status: string;
  private readonly _createdAt: Date;

  private constructor(
    id: string,
    paymentId: string,
    receiptNumber: string,
    notes: string | null,
    status: string,
    createdAt: Date
  ) {
    this._id = id;
    this._paymentId = paymentId;
    this._receiptNumber = receiptNumber;
    this._notes = notes;
    this._status = status;
    this._createdAt = createdAt;
  }

  static create(
    paymentId: string,
    receiptNumber: string,
    notes?: string
  ): PaymentDetail {
    const { v4: uuidv4 } = require('uuid');
    return new PaymentDetail(
      uuidv4(),
      paymentId,
      receiptNumber,
      notes || null,
      'verified',
      new Date()
    );
  }

  static fromPersistence(
    id: string,
    paymentId: string,
    receiptNumber: string,
    notes: string | null,
    status: string,
    createdAt: Date
  ): PaymentDetail {
    return new PaymentDetail(
      id,
      paymentId,
      receiptNumber,
      notes,
      status,
      createdAt
    );
  }

  get id(): string { return this._id; }
  get paymentId(): string { return this._paymentId; }
  get receiptNumber(): string { return this._receiptNumber; }
  get notes(): string | null { return this._notes; }
  get status(): string { return this._status; }
  get createdAt(): Date { return this._createdAt; }

  updateNotes(notes: string): void {
    this._notes = notes;
  }

  updateStatus(status: string): void {
    this._status = status;
  }
}