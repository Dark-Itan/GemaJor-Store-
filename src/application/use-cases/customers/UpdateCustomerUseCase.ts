import { ICustomerRepository } from '@/domain/repositories/ICustomerRepository';
import { CustomerId } from '@/domain/value-objects/CustomerId';
import { NotFoundError } from '@/shared/errors/NotFoundError';
import { UpdateCustomerDTO, CustomerResponseDTO } from '@/application/dto/CustomerDTO';

export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string, data: UpdateCustomerDTO): Promise<CustomerResponseDTO> {
    // 1. Buscar cliente
    const customerId = new CustomerId(id);
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new NotFoundError('CUSTOMER', { id });
    }

    // 2. Actualizar nombre si se proporciona
    if (data.firstName || data.lastName) {
      customer.updateName(
        data.firstName || customer.firstName,
        data.lastName || customer.lastName
      );
    }

    // 3. Actualizar teléfono si se proporciona
    if (data.phone !== undefined) {
      customer.updatePhone(data.phone);
    }

    // 4. Guardar cambios
    const updatedCustomer = await this.customerRepository.update(customer);

    // 5. Retornar DTO
    return {
      id: updatedCustomer.id.toString(),
      firstName: updatedCustomer.firstName,
      lastName: updatedCustomer.lastName,
      email: updatedCustomer.email.toString(),
      phone: updatedCustomer.phone.toString(),
      createdAt: updatedCustomer.createdAt
    };
  }
}