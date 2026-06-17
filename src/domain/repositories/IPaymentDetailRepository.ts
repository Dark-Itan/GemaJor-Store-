import { PaymentDetail } from '../entities/PaymentDetail';

export interface IPaymentDetailRepository {
  save(detail: PaymentDetail): Promise<PaymentDetail>;
  findByPaymentId(paymentId: string): Promise<PaymentDetail[]>;
  findById(id: string): Promise<PaymentDetail | null>;
  findByReceiptNumber(receiptNumber: string): Promise<PaymentDetail | null>;
  update(detail: PaymentDetail): Promise<PaymentDetail>;
}