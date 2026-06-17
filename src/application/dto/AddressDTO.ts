// Datos que entran al crear una dirección
export interface CreateAddressDTO {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

// Datos que salen al consultar una dirección
export interface AddressResponseDTO {
  id: string;
  customerId: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}