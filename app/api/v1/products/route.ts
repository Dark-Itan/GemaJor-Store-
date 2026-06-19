import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma/prismaClient';
import { errorHandler } from '@/infrastructure/middlewares/errorHandler';
import { authMiddleware } from '@/infrastructure/middlewares/authMiddleware';
import { roleMiddleware } from '@/infrastructure/middlewares/roleMiddleware';

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const search = searchParams.get('search') || '';
    const where: any = search ? { name: { contains: search, mode: 'insensitive' } } : {};
    const [data, total] = await Promise.all([
      prisma.product.findMany({ where, skip: (page - 1) * limit, take: limit }),
      prisma.product.count({ where })
    ]);
    return NextResponse.json({ data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  });
}

export async function POST(request: NextRequest) {
  return errorHandler(async () => {
    const user = authMiddleware(request);
    roleMiddleware(user, ['admin']);
    const body = await request.json();
    const product = await prisma.product.create({ data: body });
    return NextResponse.json(product, { status: 201 });
  });
}