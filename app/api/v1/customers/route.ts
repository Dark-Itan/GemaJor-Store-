import { NextRequest } from 'next/server';
import { CustomerController } from '@/infrastructure/controllers/CustomerController';
import { errorHandler } from '@/infrastructure/middlewares/errorHandler';
import { authMiddleware } from '@/infrastructure/middlewares/authMiddleware';
import { roleMiddleware } from '@/infrastructure/middlewares/roleMiddleware';

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const user = authMiddleware(request);
    roleMiddleware(user, ['admin']);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;

    return CustomerController.list(page, limit, search);
  });
}

export async function POST(request: NextRequest) {
  return errorHandler(async () => {
    const body = await request.json();
    return CustomerController.register(body);
  });
}