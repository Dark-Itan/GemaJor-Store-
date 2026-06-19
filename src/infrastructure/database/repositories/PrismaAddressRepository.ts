import { Address } from '@/domain/entities/Address';
import { IAddressRepository } from '@/domain/repositories/IAddressRepository';
import { prisma } from '../prisma/prismaClient';

export class PrismaAddressRepository implements IAddressRepository {
  async save(address: Address): Promise<Address> {
    const saved = await prisma.address.create({
      data: {
        id: address.id,
        customerId: address.customerId.toString(),
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode.toString(),
        country: address.country,
        isDefault: address.isDefault
      }
    });
    return Address.fromPersistence(saved.id, saved.customerId, saved.street, saved.city, saved.state, saved.zipCode, saved.country, saved.isDefault);
  }

  async findByCustomerId(customerId: string): Promise<Address[]> {
    const found = await prisma.address.findMany({ where: { customerId } });
    return found.map(a => Address.fromPersistence(a.id, a.customerId, a.street, a.city, a.state, a.zipCode, a.country, a.isDefault));
  }

  async findById(id: string): Promise<Address | null> {
    const found = await prisma.address.findUnique({ where: { id } });
    if (!found) return null;
    return Address.fromPersistence(found.id, found.customerId, found.street, found.city, found.state, found.zipCode, found.country, found.isDefault);
  }

  async delete(id: string): Promise<void> {
    await prisma.address.delete({ where: { id } });
  }

  async countByCustomerId(customerId: string): Promise<number> {
    return prisma.address.count({ where: { customerId } });
  }
}