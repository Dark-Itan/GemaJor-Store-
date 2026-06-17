import { Address } from '../entities/Address';

export interface IAddressRepository {
  save(address: Address): Promise<Address>;
  findByCustomerId(customerId: string): Promise<Address[]>;
  findById(id: string): Promise<Address | null>;
  delete(id: string): Promise<void>;
  countByCustomerId(customerId: string): Promise<number>;
}