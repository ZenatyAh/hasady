import { apiDelete, apiGet, apiPost } from '@/lib/api-client';

export interface AuctionBid {
  id: string;
  productId: string;
  amount: number;
  status?: string;
  createdAt?: string;
}

export async function placeBid(payload: {
  productId: string;
  amount: number;
}): Promise<AuctionBid> {
  return apiPost('/auctions/bids', payload);
}

export async function getMyBids(): Promise<AuctionBid[]> {
  return apiGet('/auctions/bids/mine');
}

export async function withdrawBid(bidId: string): Promise<void> {
  await apiDelete(`/auctions/bids/${bidId}`);
}

export async function getProductBids(productId: string): Promise<AuctionBid[]> {
  return apiGet(`/auctions/merchant/products/${productId}/bids`);
}

export async function acceptBid(bidId: string): Promise<{ message?: string }> {
  return apiPost(`/auctions/merchant/bids/${bidId}/accept`, {});
}
