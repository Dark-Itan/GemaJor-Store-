import { Address } from '@/domain/entities/Address';
import { IAddressRepository } from '@/domain/repositories/IAddressRepository';
import { ICustomerRepository } from '@/domain/repositories/ICustomerRepository';
import { CustomerId } from '@/domain/value-objects/CustomerId';
import { NotFoundError } from '@/shared/errors/NotFoundError';
import { CreateAddressDTO, AddressResponseDTO } from '../../dto/AddressDTO';

export class AddAddressUseCase {
  constructor(
    private readonly addressRepository: IAddressRepository,
    private readonly customerRepository: ICustomerRepository
  ) {}

  async execute(customerId: string, data: CreateAddressDTO): Promise<AddressResponseDTO> {
    // 1. Validar que el cliente existe (RN-P02 aplicado a Address)
    const cId = new CustomerId(customerId);
    const customer = await this.customerRepository.findById(cId);

    if (!customer) {
      throw new NotFoundError('CUSTOMER', { customerId });
    }

    // 2. Crear la dirección (valida RN-A02 internamente con ZipCode)
    const address = Address.create(
      customerId,
      data.street,
      data.city,
      data.state,
      data.zipCode,
      data.country,
      data.isDefault || false
    );

    // 3. Guardar en BD
    const savedAddress = await this.addressRepository.save(address);

    // 4. Retornar DTO
    return {
      id: savedAddress.id,
      customerId: savedAddress.customerId.toString(),
      street: savedAddress.street,
      city: savedAddress.city,
      state: savedAddress.state,
      zipCode: savedAddress.zipCode.toString(),
      country: savedAddress.country,
      isDefault: savedAddress.isDefault
    };
  }
}