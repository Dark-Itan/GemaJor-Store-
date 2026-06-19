import { AddPaymentDetailUseCase } from '../../application/use-cases/payment-details/AddPaymentDetailUseCase';
import { ListPaymentDetailsUseCase } from '../../application/use-cases/payment-details/ListPaymentDetailsUseCase';
import { UpdatePaymentDetailUseCase } from '../../application/use-cases/payment-details/UpdatePaymentDetailUseCase';
import { PrismaPaymentDetailRepository } from '../database/repositories/PrismaPaymentDetailRepository';
import { PrismaPaymentRepository } from '../database/repositories/PrismaPaymentRepository';
import { ApiResponse } from '../responses/ApiResponse';

const paymentDetailRepository = new PrismaPaymentDetailRepository();
const paymentRepository = new PrismaPaymentRepository();

export class PaymentDetailController {
  static async add(paymentId: string, body: any) {
    const useCase = new AddPaymentDetailUseCase(paymentDetailRepository, paymentRepository);
    const result = await useCase.execute(paymentId, body);
    return ApiResponse.created(result);
  }

  static async listByPayment(paymentId: string) {
    const useCase = new ListPaymentDetailsUseCase(paymentDetailRepository);
    const result = await useCase.execute(paymentId);
    return ApiResponse.success(result, 200);
  }

  static async update(detailId: string, body: any) {
    const useCase = new UpdatePaymentDetailUseCase(paymentDetailRepository);
    const result = await useCase.execute(detailId, body);
    return ApiResponse.success(result, 200);
  }
}