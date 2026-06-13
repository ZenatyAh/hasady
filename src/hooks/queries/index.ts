'use client';

import { useQuery } from '@tanstack/react-query';
import { browseMarket } from '@/services/api/market';
import { getMyOrders, getIncomingOrders, getOrderDetail } from '@/services/api/orders';
import { getWalletSummary, getWalletTransactions } from '@/services/api/wallet';
import { getNotifications, getUnreadCount } from '@/services/api/notifications';
import { getGivenRatings, getReceivedRatings } from '@/services/api/ratings';
import { getBuyerPayments } from '@/services/api/payments';
import { queryKeys } from '@/lib/query-keys';
import type { MarketFilters } from '@/services/api/market';

export function useMarketProducts(filters: MarketFilters, token?: string | null) {
  return useQuery({
    queryKey: queryKeys.market(filters),
    queryFn: () => browseMarket(filters, token),
    enabled: Boolean(token) || true,
  });
}

export function useMyOrders(token?: string | null) {
  return useQuery({
    queryKey: queryKeys.myOrders,
    queryFn: () => getMyOrders(token),
    enabled: Boolean(token),
  });
}

export function useIncomingOrders(token?: string | null) {
  return useQuery({
    queryKey: queryKeys.incomingOrders,
    queryFn: () => getIncomingOrders(token),
    enabled: Boolean(token),
  });
}

export function useOrderDetail(id: string, token?: string | null) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => getOrderDetail(id, token),
    enabled: Boolean(token) && Boolean(id),
  });
}

export function useWalletSummary(token?: string | null) {
  return useQuery({
    queryKey: queryKeys.wallet,
    queryFn: () => getWalletSummary(token),
    enabled: Boolean(token),
  });
}

export function useWalletTransactions(token?: string | null) {
  return useQuery({
    queryKey: queryKeys.walletTransactions,
    queryFn: () => getWalletTransactions(token),
    enabled: Boolean(token),
  });
}

export function useBuyerPayments(token?: string | null) {
  return useQuery({
    queryKey: queryKeys.payments,
    queryFn: () => getBuyerPayments(token),
    enabled: Boolean(token),
  });
}

export function useNotifications(token?: string | null) {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => getNotifications(1, 20, token),
    enabled: Boolean(token),
  });
}

export function useUnreadNotificationCount(token?: string | null) {
  return useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: () => getUnreadCount(token),
    enabled: Boolean(token),
    refetchInterval: 30_000,
  });
}

export function useReceivedRatings(token?: string | null) {
  return useQuery({
    queryKey: queryKeys.ratingsReceived,
    queryFn: () => getReceivedRatings(1, 20, token),
    enabled: Boolean(token),
  });
}

export function useGivenRatings(token?: string | null) {
  return useQuery({
    queryKey: queryKeys.ratingsGiven,
    queryFn: () => getGivenRatings(1, 20, token),
    enabled: Boolean(token),
  });
}
