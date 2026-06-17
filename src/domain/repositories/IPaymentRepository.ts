import { Payment } from '../entities/Payment';
import { PaymentStatusType } from '../value-objects/PaymentStatus';

export interface IPaymentRepository {
  save(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByCustomerId(customerId: string, page: number, limit: number, status?: PaymentStatusType): Promise<{ data: Payment[]; total: number }>;
  update(payment: Payment): Promise<Payment>;
}