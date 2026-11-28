export type PaymentMethod = 'CARD' | 'PAYPAL';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

/**
 * Request payload to pay a completed trip.
 */
export interface CreatePaymentRequest {
  tripId: string;
  totalAmount: number;
  method: PaymentMethod;
  paymentToken: string;
}

/**
 * Payment resource returned by the platform API.
 */
export interface PaymentEntity {
  id: string;
  tripId: string;
  shipperId: string;
  carrierId: string;
  totalAmount: number;
  platformFee: number;
  payoutAmount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  gatewayReference: string | null;
  errorCode: string | null;
  attempts: number;
  enabledAt: string;
  processedAt: string | null;
}

