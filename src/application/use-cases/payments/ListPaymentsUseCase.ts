import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { PaymentStatusType } from '../../../domain/value-objects/PaymentStatus';
import { PaginatedResult } from '../../../shared/types/PaginatedResult';
import { PaymentResponseDTO } from '../dto/PaymentDTO';

export class ListPaymentsUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    customerId?: string,
    status?: string
  ): Promise<PaginatedResult<PaymentResponseDTO>> {
    // 1. Validar límite máximo
    if (limit > 100) {
      limit = 100;
    }

    // 2. Consultar con filtros
    const result = await this.paymentRepository.findByCustomerId(
      customerId || '',
      page,
      limit,
      status as PaymentStatusType
    );

    // 3. Mapear a DTOs
    const data: PaymentResponseDTO[] = result.data.map(payment => ({
      id: payment.id,
      customerId: payment.customerId.toString(),
      amount: payment.amount.toNumber(),
      currency: payment.currency,
      paymentMethod: payment.paymentMethod.toString(),
      status: payment.status.toString(),
      createdAt: payment.createdAt
    }));

    // 4. Retornar con metadatos
    return {
      data,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    };
  }
}