import { IPaymentRepository } from '@/domain/repositories/IPaymentRepository';
import { NotFoundError } from '@/shared/errors/NotFoundError';
import { UpdatePaymentDTO, PaymentResponseDTO } from '@/application/dto/PaymentDTO';
import { PaymentStatusType } from '@/domain/value-objects/PaymentStatus';

export class UpdatePaymentUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(id: string, data: UpdatePaymentDTO): Promise<PaymentResponseDTO> {
    // 1. Buscar pago
    const payment = await this.paymentRepository.findById(id);

    if (!payment) {
      throw new NotFoundError('PAYMENT', { id });
    }

    // 2. Actualizar estado (valida RN-P04 internamente con PaymentStatus)
    if (data.status) {
      switch (data.status) {
        case 'approved':
          payment.approve();
          break;
        case 'rejected':
          payment.reject();
          break;
        case 'refunded':
          payment.refund();
          break;
      }
    }

    // 3. Guardar cambios
    const updatedPayment = await this.paymentRepository.update(payment);

    // 4. Retornar DTO
    return {
      id: updatedPayment.id,
      customerId: updatedPayment.customerId.toString(),
      amount: updatedPayment.amount.toNumber(),
      currency: updatedPayment.currency,
      paymentMethod: updatedPayment.paymentMethod.toString(),
      status: updatedPayment.status.toString(),
      createdAt: updatedPayment.createdAt
    };
  }
}