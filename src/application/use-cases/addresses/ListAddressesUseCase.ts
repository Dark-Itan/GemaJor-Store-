import { IAddressRepository } from '@/domain/repositories/IAddressRepository';
import { AddressResponseDTO } from '@/application/dto/AddressDTO';

export class ListAddressesUseCase {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(customerId: string): Promise<AddressResponseDTO[]> {
    // 1. Obtener direcciones del cliente
    const addresses = await this.addressRepository.findByCustomerId(customerId);

    // 2. Mapear a DTOs
    return addresses.map(address => ({
      id: address.id,
      customerId: address.customerId.toString(),
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode.toString(),
      country: address.country,
      isDefault: address.isDefault
    }));
  }
} 