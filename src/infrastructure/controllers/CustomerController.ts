import { RegisterCustomerUseCase } from '../../application/use-cases/customers/RegisterCustomerUseCase';
import { GetCustomerUseCase } from '../../application/use-cases/customers/GetCustomerUseCase';
import { ListCustomersUseCase } from '../../application/use-cases/customers/ListCustomersUseCase';
import { UpdateCustomerUseCase } from '../../application/use-cases/customers/UpdateCustomerUseCase';
import { PrismaCustomerRepository } from '../database/repositories/PrismaCustomerRepository';
import { ApiResponse } from '../responses/ApiResponse';

const customerRepository = new PrismaCustomerRepository();

export class CustomerController {
  static async register(body: any) {
    const useCase = new RegisterCustomerUseCase(customerRepository);
    const result = await useCase.execute(body);
    return ApiResponse.created(result);
  }

  static async getById(id: string) {
    const useCase = new GetCustomerUseCase(customerRepository);
    const result = await useCase.execute(id);
    return ApiResponse.success(result, 200);
  }

  static async list(page: number, limit: number, search?: string) {
    const useCase = new ListCustomersUseCase(customerRepository);
    const result = await useCase.execute(page, limit, search);
    return ApiResponse.success(result.data, 200, result.meta);
  }

  static async update(id: string, body: any) {
    const useCase = new UpdateCustomerUseCase(customerRepository);
    const result = await useCase.execute(id, body);
    return ApiResponse.success(result, 200);
  }
}