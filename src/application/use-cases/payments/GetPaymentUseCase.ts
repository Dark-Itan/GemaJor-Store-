import { IPaymentRepository } from '@/domain/repositories/IPaymentRepository';
import { NotFoundError } from '@/shared/errors/NotFoundError';
import { PaymentResponseDTO } from '@/application/dto/PaymentDTO';

export class GetPaymentUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(id: string): Promise<PaymentResponseDTO> {
    // 1. Buscar pago por ID
    const payment = await this.paymentRepository.findById(id);

    // 2. Si no existe, lanzar 404
    if (!payment) {
      throw new NotFoundError('PAYMENT', { id });
    }

    // 3. Retornar DTO
    return {
      id: payment.id,
      customerId: payment.customerId.toString(),
      amount: payment.amount.toNumber(),
      currency: payment.currency,
      paymentMethod: payment.paymentMethod.toString(),
      status: payment.status.toString(),
      createdAt: payment.createdAt
    };
  }
}