import { PaymentDetail } from '../../../domain/entities/PaymentDetail';
import { IPaymentDetailRepository } from '../../../domain/repositories/IPaymentDetailRepository';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { CreatePaymentDetailDTO, PaymentDetailResponseDTO } from '../dto/PaymentDetailDTO';

export class AddPaymentDetailUseCase {
  constructor(
    private readonly paymentDetailRepository: IPaymentDetailRepository,
    private readonly paymentRepository: IPaymentRepository
  ) {}

  async execute(paymentId: string, data: CreatePaymentDetailDTO): Promise<PaymentDetailResponseDTO> {
    // 1. Validar que el pago existe (RN-PD01)
    const payment = await this.paymentRepository.findById(paymentId);

    if (!payment) {
      throw new NotFoundError('PAYMENT', { paymentId });
    }

    // 2. Validar que el comprobante no esté duplicado (RN-PD03)
    const existingReceipt = await this.paymentDetailRepository.findByReceiptNumber(data.receiptNumber);

    if (existingReceipt) {
      throw new ConflictError(
        'DUPLICATE_RECEIPT',
        'Este comprobante ya fue registrado. Revisa el numero e intentalo con uno diferente.',
        { receiptNumber: data.receiptNumber }
      );
    }

    // 3. Crear el detalle
    const detail = PaymentDetail.create(
      paymentId,
      data.receiptNumber,
      data.notes
    );

    // 4. Guardar en BD
    const savedDetail = await this.paymentDetailRepository.save(detail);

    // 5. Retornar DTO
    return {
      id: savedDetail.id,
      paymentId: savedDetail.paymentId,
      receiptNumber: savedDetail.receiptNumber,
      notes: savedDetail.notes,
      status: savedDetail.status,
      createdAt: savedDetail.createdAt
    };
  }
}