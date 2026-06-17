import { IPaymentDetailRepository } from '../../../domain/repositories/IPaymentDetailRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ValidationError } from '../../../shared/errors/ValidationError';
import { UpdatePaymentDetailDTO, PaymentDetailResponseDTO } from '../dto/PaymentDetailDTO';

export class UpdatePaymentDetailUseCase {
  constructor(private readonly paymentDetailRepository: IPaymentDetailRepository) {}

  async execute(detailId: string, data: UpdatePaymentDetailDTO): Promise<PaymentDetailResponseDTO> {
    // 1. Buscar detalle
    const detail = await this.paymentDetailRepository.findById(detailId);

    if (!detail) {
      throw new NotFoundError('PAYMENT_DETAIL', { detailId });
    }

    // 2. Validar RN-PD02: No permitir modificar receiptNumber
    if ((data as any).receiptNumber) {
      throw new ValidationError(
        'FIELD_NOT_UPDATABLE',
        'Algunos datos de este registro no se pueden modificar despues de haber sido creados.',
        { receiptNumber: (data as any).receiptNumber }
      );
    }

    // 3. Actualizar campos permitidos
    if (data.notes !== undefined) {
      detail.updateNotes(data.notes);
    }

    if (data.status !== undefined) {
      detail.updateStatus(data.status);
    }

    // 4. Guardar cambios
    const updatedDetail = await this.paymentDetailRepository.update(detail);

    // 5. Retornar DTO
    return {
      id: updatedDetail.id,
      paymentId: updatedDetail.paymentId,
      receiptNumber: updatedDetail.receiptNumber,
      notes: updatedDetail.notes,
      status: updatedDetail.status,
      createdAt: updatedDetail.createdAt
    };
  }
}