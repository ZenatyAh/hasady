'use client';

import { useQuery } from '@tanstack/react-query';
import type { MarketFilters } from '@/services/api/market';
import { browseMarket, getMarketProduct } from '@/services/api/market';
import { getMyOrders, getIncomingOrders, getOrderDetail } from '@/services/api/orders';
import { getWalletSummary, getWalletTransactions } from '@/services/api/wallet';
import { getNotifications, getUnreadCount } from '@/services/api/notifications';
import { getGivenRatings, getReceivedRatings } from '@/services/api/ratings';
import { getBuyerPayments } from '@/services/api/payments';
import { getMe, getPublicProfile } from '@/services/api/users';
import { useAuthStore } from '@/lib/store';
import { queryKeys } from '@/lib/query-keys';

export function useMe() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    enabled: Boolean(accessToken),
  });
}

export function usePublicProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.publicProfile(userId),
    queryFn: () => getPublicProfile(userId),
    enabled: Boolean(userId),
  });
}

export function useMarketProducts(filters: MarketFilters) {
  return useQuery({
    queryKey: queryKeys.market(filters),
    queryFn: () => browseMarket(filters),
  });
}

export function useMarketProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.marketProduct(id),
    queryFn: () => getMarketProduct(id),
    enabled: Boolean(id),
  });
}

export function useMyOrders() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: queryKeys.myOrders,
    queryFn: getMyOrders,
    enabled: Boolean(accessToken),
  });
}

export function useIncomingOrders() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: queryKeys.incomingOrders,
    queryFn: getIncomingOrders,
    enabled: Boolean(accessToken),
  });
}

export function useOrderDetail(id: string) {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => getOrderDetail(id),
    enabled: Boolean(accessToken) && Boolean(id),
  });
}

export function useWalletSummary() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: queryKeys.wallet,
    queryFn: getWalletSummary,
    enabled: Boolean(accessToken),
  });
}

export function useWalletTransactions() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: queryKeys.walletTransactions,
    queryFn: getWalletTransactions,
    enabled: Boolean(accessToken),
  });
}

export function useBuyerPayments() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: queryKeys.payments,
    queryFn: getBuyerPayments,
    enabled: Boolean(accessToken),
  });
}

export function useNotifications() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => getNotifications(1, 20),
    enabled: Boolean(accessToken),
  });
}

export function useUnreadNotificationCount() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: getUnreadCount,
    enabled: Boolean(accessToken),
    refetchInterval: 30_000,
  });
}

export function useReceivedRatings() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: queryKeys.ratingsReceived,
    queryFn: () => getReceivedRatings(1, 20),
    enabled: Boolean(accessToken),
  });
}

export function useGivenRatings() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: queryKeys.ratingsGiven,
    queryFn: () => getGivenRatings(1, 20),
    enabled: Boolean(accessToken),
  });
}
