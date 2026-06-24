import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma/prismaClient';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gemajor-secret-key';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Admin: userId + role
  if (body.userId && body.role) {
    const token = jwt.sign({ userId: body.userId, role: body.role }, JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({ token, role: body.role });
  }

  // Cliente: email + password
  if (body.email && body.password) {
    const customer = await prisma.customer.findUnique({ where: { email: body.email } });
    if (!customer) {
      return NextResponse.json({ code: 'CUSTOMER_NOT_FOUND', message: 'Cliente no encontrado' }, { status: 404 });
    }
    const token = jwt.sign({ userId: customer.id, role: 'customer' }, JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({ token, role: 'customer', firstName: customer.firstName });
  }

  return NextResponse.json({ code: 'INVALID_REQUEST', message: 'Datos inválidos' }, { status: 400 });
}