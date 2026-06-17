import { NextRequest } from 'next/server';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gemajor-secret-key';

export interface AuthPayload {
  userId: string;
  role: 'customer' | 'admin';
}

export function authMiddleware(request: NextRequest): AuthPayload {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError();
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return payload;
  } catch {
    throw new UnauthorizedError();
  }
}