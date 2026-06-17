import { apiGet, apiPost } from '@/lib/api-client';

export interface PaymentRecord {
  id: string;
  orderId?: string;
  amount: number | string;
  status: string;
  currency?: string;
  createdAt?: string;
  gatewayUrl?: string | null;
}

export interface InitiatePaymentResult {
  paymentUrl: string;
  paymentId: string;
}

export async function getBuyerPayments(): Promise<PaymentRecord[]> {
  return apiGet('/payments');
}

export async function getPaymentDetail(id: string): Promise<PaymentRecord> {
  return apiGet(`/payments/${id}`);
}

export async function initiatePayment(orderId: string): Promise<InitiatePaymentResult> {
  return apiPost(`/payments/orders/${orderId}/initiate`, {});
}
