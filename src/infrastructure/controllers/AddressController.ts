import { AddAddressUseCase } from '../../application/use-cases/addresses/AddAddressUseCase';
import { ListAddressesUseCase } from '../../application/use-cases/addresses/ListAddressesUseCase';
import { DeleteAddressUseCase } from '../../application/use-cases/addresses/DeleteAddressUseCase';
import { PrismaAddressRepository } from '../database/repositories/PrismaAddressRepository';
import { PrismaCustomerRepository } from '../database/repositories/PrismaCustomerRepository';
import { ApiResponse } from '../responses/ApiResponse';

const addressRepository = new PrismaAddressRepository();
const customerRepository = new PrismaCustomerRepository();

export class AddressController {
  static async add(customerId: string, body: any) {
    const useCase = new AddAddressUseCase(addressRepository, customerRepository);
    const result = await useCase.execute(customerId, body);
    return ApiResponse.created(result);
  }

  static async listByCustomer(customerId: string) {
    const useCase = new ListAddressesUseCase(addressRepository);
    const result = await useCase.execute(customerId);
    return ApiResponse.success(result, 200);
  }

  static async delete(addressId: string) {
    const useCase = new DeleteAddressUseCase(addressRepository);
    await useCase.execute(addressId);
    return ApiResponse.noContent();
  }
}