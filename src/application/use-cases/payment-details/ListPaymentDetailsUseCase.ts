import { IPaymentDetailRepository } from '@/domain/repositories/IPaymentDetailRepository';
import { PaymentDetailResponseDTO } from '@/application/dto/PaymentDetailDTO';

export class ListPaymentDetailsUseCase {
  constructor(private readonly paymentDetailRepository: IPaymentDetailRepository) {}

  async execute(paymentId: string): Promise<PaymentDetailResponseDTO[]> {
    // 1. Obtener detalles del pago
    const details = await this.paymentDetailRepository.findByPaymentId(paymentId);

    // 2. Mapear a DTOs
    return details.map(detail => ({
      id: detail.id,
      paymentId: detail.paymentId,
      receiptNumber: detail.receiptNumber,
      notes: detail.notes,
      status: detail.status,
      createdAt: detail.createdAt
    }));
  }
}