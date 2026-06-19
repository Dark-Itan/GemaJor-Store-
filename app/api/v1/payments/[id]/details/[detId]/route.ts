import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma/prismaClient';
import { errorHandler } from '@/infrastructure/middlewares/errorHandler';
import { authMiddleware } from '@/infrastructure/middlewares/authMiddleware';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ detId: string }> }) {
  return errorHandler(async () => {
    const user = authMiddleware(request);
    if (user.role !== 'admin') return NextResponse.json({ code: 'FORBIDDEN', message: 'No autorizado', details: {} }, { status: 403 });
    const { detId } = await params;
    const body = await request.json();
    const detail = await prisma.paymentDetail.update({
      where: { id: detId },
      data: { notes: body.notes, status: body.status }
    });
    return NextResponse.json(detail);
  });
}