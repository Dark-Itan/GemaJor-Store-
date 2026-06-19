import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma/prismaClient';
import { errorHandler } from '@/infrastructure/middlewares/errorHandler';
import { authMiddleware } from '@/infrastructure/middlewares/authMiddleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return errorHandler(async () => {
    authMiddleware(request);
    const { id } = await params;
    const details = await prisma.paymentDetail.findMany({ where: { paymentId: id } });
    return NextResponse.json({ data: details });
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return errorHandler(async () => {
    const user = authMiddleware(request);
    if (user.role !== 'admin') return NextResponse.json({ code: 'FORBIDDEN', message: 'No autorizado', details: {} }, { status: 403 });
    const { id } = await params;
    const body = await request.json();
    const detail = await prisma.paymentDetail.create({
      data: { paymentId: id, receiptNumber: body.receiptNumber, notes: body.notes }
    });
    return NextResponse.json(detail, { status: 201 });
  });
}