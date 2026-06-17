import { Payment } from '../../../../domain/entities/Payment';
import { IPaymentRepository } from '../../../../domain/repositories/IPaymentRepository';
import { PaymentStatusType } from '../../../../domain/value-objects/PaymentStatus';
import { PaymentMethodType } from '../../../../domain/value-objects/PaymentMethod';
import { prisma } from '../prisma/prismaClient';

export class PrismaPaymentRepository implements IPaymentRepository {
  async save(payment: Payment): Promise<Payment> {
    const saved = await prisma.payment.create({
      data: {
        id: payment.id,
        customerId: payment.customerId.toString(),
        amount: payment.amount.toNumber(),
        currency: payment.currency,
        paymentMethod: payment.paymentMethod.toString(),
        status: payment.status.toString(),
        createdAt: payment.createdAt
      }
    });

    return Payment.fromPersistence(
      saved.id, saved.customerId, saved.amount.toNumber(), saved.currency,
      saved.paymentMethod as PaymentMethodType, saved.status as PaymentStatusType, saved.createdAt
    );
  }

  async findById(id: string): Promise<Payment | null> {
    const found = await prisma.payment.findUnique({ where: { id } });
    if (!found) return null;
    return Payment.fromPersistence(
      found.id, found.customerId, found.amount.toNumber(), found.currency,
      found.paymentMethod as PaymentMethodType, found.status as PaymentStatusType, found.createdAt
    );
  }

  async findByCustomerId(customerId: string, page: number, limit: number, status?: PaymentStatusType): Promise<{ data: Payment[]; total: number }> {
    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.payment.count({ where })
    ]);

    return {
      data: data.map(p => Payment.fromPersistence(
        p.id, p.customerId, p.amount.toNumber(), p.currency,
        p.paymentMethod as PaymentMethodType, p.status as PaymentStatusType, p.createdAt
      )),
      total
    };
  }

  async update(payment: Payment): Promise<Payment> {
    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: payment.status.toString() }
    });

    return Payment.fromPersistence(
      updated.id, updated.customerId, updated.amount.toNumber(), updated.currency,
      updated.paymentMethod as PaymentMethodType, updated.status as PaymentStatusType, updated.createdAt
    );
  }
}