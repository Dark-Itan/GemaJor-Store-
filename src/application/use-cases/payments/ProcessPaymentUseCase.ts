import { Payment } from '@/domain/entities/Payment';
import { IPaymentRepository } from '@/domain/repositories/IPaymentRepository';
import { ICustomerRepository } from '@/domain/repositories/ICustomerRepository';
import { CustomerId } from '@/domain/value-objects/CustomerId';
import { NotFoundError } from '@/shared/errors/NotFoundError';
import { CreatePaymentDTO, PaymentResponseDTO } from '@/application/dto/PaymentDTO';

export class ProcessPaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly customerRepository: ICustomerRepository
  ) {}

  async execute(data: CreatePaymentDTO): Promise<PaymentResponseDTO> {
    // 1. Validar que el cliente existe (RN-P02)
    const customerId = new CustomerId(data.customerId);
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new NotFoundError('CUSTOMER', { customerId: data.customerId });
    }

    // 2. Crear el pago (valida RN-P01 y RN-P03 internamente con Money y PaymentMethod)
    const payment = Payment.create(
      data.customerId,
      data.amount,
      data.currency,
      data.paymentMethod
    );

    // 3. Guardar en BD
    const savedPayment = await this.paymentRepository.save(payment);

    // 4. Retornar DTO
    return {
      id: savedPayment.id,
      customerId: savedPayment.customerId.toString(),
      amount: savedPayment.amount.toNumber(),
      currency: savedPayment.currency,
      paymentMethod: savedPayment.paymentMethod.toString(),
      status: savedPayment.status.toString(),
      createdAt: savedPayment.createdAt
    };
  }
}