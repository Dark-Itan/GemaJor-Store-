import { Customer } from '@/domain/entities/Customer';
import { ICustomerRepository } from '@/domain/repositories/ICustomerRepository';
import { Email } from '@/domain/value-objects/Email';
import { ConflictError } from '@/shared/errors/ConflictError';
import { CreateCustomerDTO, CustomerResponseDTO } from '@/application/dto/CustomerDTO';
import bcrypt from 'bcryptjs';

export class RegisterCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(data: CreateCustomerDTO): Promise<CustomerResponseDTO> {
    // 1. Validar que el email no exista (RN-C01)
    const email = new Email(data.email);
    const existingCustomer = await this.customerRepository.findByEmail(email);
    
    if (existingCustomer) {
      throw new ConflictError(
        'EMAIL_ALREADY_EXISTS',
        'Este correo ya tiene una cuenta. Quieres iniciar sesion o recuperar tu contrasena?',
        { email: data.email }
      );
    }

    // 2. Hashear la contraseña (Seguridad)
    const passwordHash = await bcrypt.hash(data.password, 10);

    // 3. Crear la entidad Customer (valida RN-C02, RN-C03 internamente)
    const customer = Customer.create(
      data.firstName,
      data.lastName,
      data.email,
      passwordHash,
      data.phone
    );

    // 4. Guardar en la base de datos (a través del repositorio)
    const savedCustomer = await this.customerRepository.save(customer);

    // 5. Retornar DTO de respuesta
    return {
      id: savedCustomer.id.toString(),
      firstName: savedCustomer.firstName,
      lastName: savedCustomer.lastName,
      email: savedCustomer.email.toString(),
      phone: savedCustomer.phone.toString(),
      createdAt: savedCustomer.createdAt
    };
  }
}