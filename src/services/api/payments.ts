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

export async function getBuyerPayments(token?: string | null): Promise<PaymentRecord[]> {
  return apiGet(
    '/payments',
    () =>
      Promise.resolve([
        {
          id: 'pay-1',
          orderId: 'ord-1',
          amount: 3500,
          status: 'COMPLETED',
          currency: 'SAR',
          createdAt: new Date().toISOString(),
        },
      ]),
    { token }
  );
}

export async function getPaymentDetail(id: string, token?: string | null): Promise<PaymentRecord> {
  return apiGet(
    `/payments/${id}`,
    () =>
      Promise.resolve({
        id,
        amount: 3500,
        status: 'COMPLETED',
      }),
    { token }
  );
}

export async function initiatePayment(
  orderId: string,
  token?: string | null
): Promise<InitiatePaymentResult> {
  return apiPost(
    `/payments/orders/${orderId}/initiate`,
    {},
    () =>
      Promise.resolve({
        paymentUrl: `https://checkout.stripe.com/mock/${orderId}`,
        paymentId: `pay-${orderId}`,
      }),
    { token }
  );
}
