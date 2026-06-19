import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma/prismaClient';
import { errorHandler } from '@/infrastructure/middlewares/errorHandler';
import { authMiddleware } from '@/infrastructure/middlewares/authMiddleware';
import { roleMiddleware } from '@/infrastructure/middlewares/roleMiddleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return errorHandler(async () => {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado', details: { id } }, { status: 404 });
    return NextResponse.json(product);
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return errorHandler(async () => {
    const user = authMiddleware(request);
    roleMiddleware(user, ['admin']);
    const { id } = await params;
    const body = await request.json();
    const product = await prisma.product.update({ where: { id }, data: body });
    return NextResponse.json(product);
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return errorHandler(async () => {
    const user = authMiddleware(request);
    roleMiddleware(user, ['admin']);
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Producto eliminado exitosamente' }, { status: 200 });
  });
}