import { Customer } from '../entities/Customer';
import { CustomerId } from '../value-objects/CustomerId';
import { Email } from '../value-objects/Email';

export interface ICustomerRepository {
  save(customer: Customer): Promise<Customer>;
  findById(id: CustomerId): Promise<Customer | null>;
  findByEmail(email: Email): Promise<Customer | null>;
  findAll(page: number, limit: number, search?: string): Promise<{ data: Customer[]; total: number }>;
  update(customer: Customer): Promise<Customer>;
}