// Datos que entran al crear un detalle de pago
export interface CreatePaymentDetailDTO {
  receiptNumber: string;
  notes?: string;
}

// Datos que entran al actualizar un detalle
export interface UpdatePaymentDetailDTO {
  notes?: string;
  status?: string;
}

// Datos que salen al consultar un detalle
export interface PaymentDetailResponseDTO {
  id: string;
  paymentId: string;
  receiptNumber: string;
  notes: string | null;
  status: string;
  createdAt: Date;
}