import { ICustomerRepository } from '../../../domain/repositories/ICustomerRepository';
import { CustomerResponseDTO } from '../dto/CustomerDTO';
import { PaginatedResult } from '../../../shared/types/PaginatedResult';

export class ListCustomersUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResult<CustomerResponseDTO>> {
    // 1. Validar límite máximo (Punto 8: max 100)
    if (limit > 100) {
      limit = 100;
    }

    // 2. Consultar con paginación y búsqueda
    const result = await this.customerRepository.findAll(page, limit, search);

    // 3. Mapear a DTOs
    const data: CustomerResponseDTO[] = result.data.map(customer => ({
      id: customer.id.toString(),
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email.toString(),
      phone: customer.phone.toString(),
      createdAt: customer.createdAt
    }));

    // 4. Retornar con metadatos de paginación
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