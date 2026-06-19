import { ProcessPaymentUseCase } from '../../application/use-cases/payments/ProcessPaymentUseCase';
import { GetPaymentUseCase } from '../../application/use-cases/payments/GetPaymentUseCase';
import { ListPaymentsUseCase } from '../../application/use-cases/payments/ListPaymentsUseCase';
import { UpdatePaymentUseCase } from '../../application/use-cases/payments/UpdatePaymentUseCase';
import { PrismaPaymentRepository } from '../database/repositories/PrismaPaymentRepository';
import { PrismaCustomerRepository } from '../database/repositories/PrismaCustomerRepository';
import { ApiResponse } from '../responses/ApiResponse';

const paymentRepository = new PrismaPaymentRepository();
const customerRepository = new PrismaCustomerRepository();

export class PaymentController {
  static async process(body: any) {
    const useCase = new ProcessPaymentUseCase(paymentRepository, customerRepository);
    const result = await useCase.execute(body);
    return ApiResponse.created(result);
  }

  static async getById(id: string) {
    const useCase = new GetPaymentUseCase(paymentRepository);
    const result = await useCase.execute(id);
    return ApiResponse.success(result, 200);
  }

  static async list(page: number, limit: number, customerId?: string, status?: string) {
    const useCase = new ListPaymentsUseCase(paymentRepository);
    const result = await useCase.execute(page, limit, customerId, status);
    return ApiResponse.success(result.data, 200, result.meta);
  }

  static async update(id: string, body: any) {
    const useCase = new UpdatePaymentUseCase(paymentRepository);
    const result = await useCase.execute(id, body);
    return ApiResponse.success(result, 200);
  }
}