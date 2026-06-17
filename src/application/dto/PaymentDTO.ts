// Datos que entran al crear un pago
export interface CreatePaymentDTO {
  customerId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

// Datos que entran al actualizar un pago
export interface UpdatePaymentDTO {
  status: string;
}

// Datos que salen al consultar un pago
export interface PaymentResponseDTO {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  createdAt: Date;
}