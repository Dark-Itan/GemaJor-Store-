import { PaymentDetail } from '@/domain/entities/PaymentDetail';
import { IPaymentDetailRepository } from '@/domain/repositories/IPaymentDetailRepository';
import { prisma } from '../prisma/prismaClient';

export class PrismaPaymentDetailRepository implements IPaymentDetailRepository {
  async save(detail: PaymentDetail): Promise<PaymentDetail> {
    const saved = await prisma.paymentDetail.create({
      data: {
        id: detail.id,
        paymentId: detail.paymentId,
        receiptNumber: detail.receiptNumber,
        notes: detail.notes,
        status: detail.status,
        createdAt: detail.createdAt
      }
    });
    return PaymentDetail.fromPersistence(saved.id, saved.paymentId, saved.receiptNumber, saved.notes, saved.status, saved.createdAt);
  }

  async findByPaymentId(paymentId: string): Promise<PaymentDetail[]> {
    const found = await prisma.paymentDetail.findMany({ where: { paymentId } });
    return found.map(d => PaymentDetail.fromPersistence(d.id, d.paymentId, d.receiptNumber, d.notes, d.status, d.createdAt));
  }

  async findById(id: string): Promise<PaymentDetail | null> {
    const found = await prisma.paymentDetail.findUnique({ where: { id } });
    if (!found) return null;
    return PaymentDetail.fromPersistence(found.id, found.paymentId, found.receiptNumber, found.notes, found.status, found.createdAt);
  }

  async findByReceiptNumber(receiptNumber: string): Promise<PaymentDetail | null> {
    const found = await prisma.paymentDetail.findUnique({ where: { receiptNumber } });
    if (!found) return null;
    return PaymentDetail.fromPersistence(found.id, found.paymentId, found.receiptNumber, found.notes, found.status, found.createdAt);
  }

  async update(detail: PaymentDetail): Promise<PaymentDetail> {
    const updated = await prisma.paymentDetail.update({
      where: { id: detail.id },
      data: { notes: detail.notes, status: detail.status }
    });
    return PaymentDetail.fromPersistence(updated.id, updated.paymentId, updated.receiptNumber, updated.notes, updated.status, updated.createdAt);
  }
}