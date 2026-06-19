import { IAddressRepository } from '@/domain/repositories/IAddressRepository';
import { NotFoundError } from '@/shared/errors/NotFoundError';
import { ConflictError } from '@/shared/errors/ConflictError';

export class DeleteAddressUseCase {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(addressId: string): Promise<void> {
    // 1. Buscar la dirección
    const address = await this.addressRepository.findById(addressId);

    if (!address) {
      throw new NotFoundError('ADDRESS', { addressId });
    }

    // 2. Validar RN-A01: No eliminar si es la única dirección predeterminada
    if (address.isDefault) {
      const addressCount = await this.addressRepository.countByCustomerId(address.customerId.toString());

      if (addressCount <= 1) {
        throw new ConflictError(
          'CANNOT_DELETE_DEFAULT_ADDRESS',
          'No puedes eliminar tu direccion principal. Agrega otra direccion y marcala como predeterminada antes de eliminar esta.',
          { addressId }
        );
      }
    }

    // 3. Eliminar
    await this.addressRepository.delete(addressId);
  }
}