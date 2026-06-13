import { apiDelete, apiGet, apiPost } from '@/lib/api-client';

const MOCK_DELAY_MS = 800;

function mockDelay<T>(fn: () => T | Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    }, MOCK_DELAY_MS);
  });
}

export interface AuctionBid {
  id: string;
  productId: string;
  amount: number;
  status?: string;
  createdAt?: string;
}

export async function placeBid(
  payload: { productId: string; amount: number },
  token?: string | null
): Promise<AuctionBid> {
  return apiPost(
    '/auctions/bids',
    payload,
    () =>
      mockDelay(() => ({
        id: `bid-${Date.now()}`,
        productId: payload.productId,
        amount: payload.amount,
        status: 'ACTIVE',
      })),
    { token }
  );
}

export async function getMyBids(token?: string | null): Promise<AuctionBid[]> {
  return apiGet('/auctions/bids/mine', () => mockDelay(() => []), { token });
}

export async function withdrawBid(bidId: string, token?: string | null): Promise<void> {
  await apiDelete(`/auctions/bids/${bidId}`, () => mockDelay(() => ({})), { token });
}

export async function getProductBids(
  productId: string,
  token?: string | null
): Promise<AuctionBid[]> {
  return apiGet(`/auctions/merchant/products/${productId}/bids`, () => mockDelay(() => []), {
    token,
  });
}

export async function acceptBid(
  bidId: string,
  token?: string | null
): Promise<{ message?: string }> {
  return apiPost(
    `/auctions/merchant/bids/${bidId}/accept`,
    {},
    () => mockDelay(() => ({ message: 'تم قبول العرض بنجاح' })),
    { token }
  );
}
