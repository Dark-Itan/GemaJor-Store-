import { NextRequest } from 'next/server';
import { CustomerController } from '@/infrastructure/controllers/CustomerController';
import { errorHandler } from '@/infrastructure/middlewares/errorHandler';
import { authMiddleware } from '@/infrastructure/middlewares/authMiddleware';
import { roleMiddleware } from '@/infrastructure/middlewares/roleMiddleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return errorHandler(async () => {
    const user = authMiddleware(request);
    const { id } = await params;
    if (user.role !== 'admin' && user.userId !== id) {
      roleMiddleware(user, ['admin']);
    }
    return CustomerController.getById(id);
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return errorHandler(async () => {
    const user = authMiddleware(request);
    const { id } = await params;
    if (user.role !== 'admin' && user.userId !== id) {
      roleMiddleware(user, ['admin']);
    }
    const body = await request.json();
    return CustomerController.update(id, body);
  });
}