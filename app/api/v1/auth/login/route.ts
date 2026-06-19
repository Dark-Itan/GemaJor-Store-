import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gemajor-secret-key';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const token = jwt.sign(
    { userId: body.userId || 'c7d2a1b4', role: body.role || 'admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return NextResponse.json({ token });
}