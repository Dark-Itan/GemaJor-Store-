import { Customer } from '../../../../domain/entities/Customer';
import { ICustomerRepository } from '../../../../domain/repositories/ICustomerRepository';
import { CustomerId } from '../../../../domain/value-objects/CustomerId';
import { Email } from '../../../../domain/value-objects/Email';
import { prisma } from '../prisma/prismaClient';

export class PrismaCustomerRepository implements ICustomerRepository {
  async save(customer: Customer): Promise<Customer> {
    const saved = await prisma.customer.create({
      data: {
        id: customer.id.toString(),
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email.toString(),
        passwordHash: customer.passwordHash,
        phone: customer.phone.toString(),
        createdAt: customer.createdAt
      }
    });

    return Customer.fromPersistence(
      saved.id,
      saved.firstName,
      saved.lastName,
      saved.email,
      saved.passwordHash,
      saved.phone,
      saved.createdAt
    );
  }

  async findById(id: CustomerId): Promise<Customer | null> {
    const found = await prisma.customer.findUnique({
      where: { id: id.toString() }
    });

    if (!found) return null;

    return Customer.fromPersistence(
      found.id,
      found.firstName,
      found.lastName,
      found.email,
      found.passwordHash,
      found.phone,
      found.createdAt
    );
  }

  async findByEmail(email: Email): Promise<Customer | null> {
    const found = await prisma.customer.findUnique({
      where: { email: email.toString() }
    });

    if (!found) return null;

    return Customer.fromPersistence(
      found.id,
      found.firstName,
      found.lastName,
      found.email,
      found.passwordHash,
      found.phone,
      found.createdAt
    );
  }

  async findAll(page: number, limit: number, search?: string): Promise<{ data: Customer[]; total: number }> {
    const where = search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const [data, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count({ where })
    ]);

    return {
      data: data.map(c => Customer.fromPersistence(
        c.id, c.firstName, c.lastName, c.email, c.passwordHash, c.phone, c.createdAt
      )),
      total
    };
  }

  async update(customer: Customer): Promise<Customer> {
    const updated = await prisma.customer.update({
      where: { id: customer.id.toString() },
      data: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone.toString()
      }
    });

    return Customer.fromPersistence(
      updated.id, updated.firstName, updated.lastName, updated.email,
      updated.passwordHash, updated.phone, updated.createdAt
    );
  }
}