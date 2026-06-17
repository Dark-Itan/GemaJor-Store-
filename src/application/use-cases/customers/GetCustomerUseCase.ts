import { Customer } from '../../../domain/entities/Customer';
import { ICustomerRepository } from '../../../domain/repositories/ICustomerRepository';
import { CustomerId } from '../../../domain/value-objects/CustomerId';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { CustomerResponseDTO } from '../dto/CustomerDTO';

export class GetCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string): Promise<CustomerResponseDTO> {
    // 1. Buscar cliente por ID
    const customerId = new CustomerId(id);
    const customer = await this.customerRepository.findById(customerId);

    // 2. Si no existe, lanzar 404
    if (!customer) {
      throw new NotFoundError('CUSTOMER', { id });
    }

    // 3. Retornar DTO de respuesta
    return {
      id: customer.id.toString(),
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email.toString(),
      phone: customer.phone.toString(),
      createdAt: customer.createdAt
    };
  }
}