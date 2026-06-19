import { NextRequest } from 'next/server';
import { PaymentController } from '@/infrastructure/controllers/PaymentController';
import { errorHandler } from '@/infrastructure/middlewares/errorHandler';
import { authMiddleware } from '@/infrastructure/middlewares/authMiddleware';

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const user = authMiddleware(request);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || undefined;
    const customerId = user.role === 'admin' ? searchParams.get('customerId') || undefined : user.userId;

    return PaymentController.list(page, limit, customerId, status);
  });
}

export async function POST(request: NextRequest) {
  return errorHandler(async () => {
    const user = authMiddleware(request);
    const body = await request.json();
    body.customerId = user.userId;
    return PaymentController.process(body);
  });
}