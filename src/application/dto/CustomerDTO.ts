// Datos que entran al crear un cliente
export interface CreateCustomerDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

// Datos que entran al actualizar un cliente
export interface UpdateCustomerDTO {
  phone?: string;
  firstName?: string;
  lastName?: string;
}

// Datos que salen al consultar un cliente
export interface CustomerResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: Date;
}