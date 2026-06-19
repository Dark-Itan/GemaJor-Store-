import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma/prismaClient';
import { errorHandler } from '@/infrastructure/middlewares/errorHandler';
import { authMiddleware } from '@/infrastructure/middlewares/authMiddleware';
import { roleMiddleware } from '@/infrastructure/middlewares/roleMiddleware';
import { PaymentStatus, PaymentStatusType } from '@/domain/value-objects/PaymentStatus';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return errorHandler(async () => {
    authMiddleware(request);
    const { id } = await params;
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return NextResponse.json({ code: 'PAYMENT_NOT_FOUND', message: 'Pago no encontrado', details: { id } }, { status: 404 });
    return NextResponse.json(payment);
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return errorHandler(async () => {
    const user = authMiddleware(request);
    roleMiddleware(user, ['admin']);
    const { id } = await params;
    const body = await request.json();

    const current = await prisma.payment.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ code: 'PAYMENT_NOT_FOUND', message: 'Pago no encontrado', details: { id } }, { status: 404 });

    const currentStatus = new PaymentStatus(current.status);
    currentStatus.transitionTo(body.status as PaymentStatusType);

    const payment = await prisma.payment.update({ where: { id }, data: { status: body.status } });
    return NextResponse.json({ message: 'Estado de pago actualizado exitosamente', payment });
  });
}