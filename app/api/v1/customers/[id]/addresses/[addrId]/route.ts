import { NextRequest } from 'next/server';
import { AddressController } from '@/infrastructure/controllers/AddressController';
import { errorHandler } from '@/infrastructure/middlewares/errorHandler';
import { authMiddleware } from '@/infrastructure/middlewares/authMiddleware';
import { roleMiddleware } from '@/infrastructure/middlewares/roleMiddleware';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; addrId: string }> }) {
  return errorHandler(async () => {
    const user = authMiddleware(request);
    const { id, addrId } = await params;
    if (user.role !== 'admin' && user.userId !== id) {
      roleMiddleware(user, ['admin']);
    }
    return AddressController.delete(addrId);
  });
}