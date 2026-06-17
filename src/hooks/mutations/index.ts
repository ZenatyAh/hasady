'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  placeOrder,
  acceptOrder,
  rejectOrder,
  confirmDelivery,
  cancelOrder,
  updateOrderStatus,
} from '@/services/api/orders';
import { placeBid } from '@/services/api/auctions';
import { initiatePayment } from '@/services/api/payments';
import { createRating } from '@/services/api/ratings';
import { markAllNotificationsRead } from '@/services/api/notifications';
import { updateMe, promoteToMerchant } from '@/services/api/users';
import { createBankAccount } from '@/services/api/bank-accounts';
import { queryKeys } from '@/lib/query-keys';
import { useAuthStore } from '@/lib/store';
import { apiUserToUser } from '@/lib/mappers/user';
import type { UpdateCurrentUserPayload } from '@/lib/api-contracts/users';

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      productId: string;
      offeredPrice: number;
      quantity: number;
      notes?: string;
    }) => placeOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myOrders });
    },
  });
}

export function usePlaceBid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { productId: string; amount: number }) => placeBid(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market'] });
    },
  });
}

export function useAcceptOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => acceptOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingOrders });
    },
  });
}

export function useRejectOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectOrder(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingOrders });
    },
  });
}

export function useConfirmDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmDelivery(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myOrders });
      queryClient.invalidateQueries({ queryKey: queryKeys.order(id) });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myOrders });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingOrders });
    },
  });
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (orderId: string) => initiatePayment(orderId),
  });
}

export function useCreateRating() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { orderId: string; score: number; comment?: string }) =>
      createRating(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ratingsGiven });
      queryClient.invalidateQueries({ queryKey: queryKeys.ratingsReceived });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setAuthSession = useAuthStore((state) => state.setAuthSession);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: (payload: UpdateCurrentUserPayload) => updateMe(payload),
    onSuccess: (apiUser) => {
      if (accessToken) {
        setAuthSession({ accessToken, refreshToken: refreshToken ?? '' }, apiUserToUser(apiUser));
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

export function usePromoteToMerchant() {
  const queryClient = useQueryClient();
  const setAuthSession = useAuthStore((state) => state.setAuthSession);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: () => promoteToMerchant(),
    onSuccess: (apiUser) => {
      if (accessToken) {
        setAuthSession({ accessToken, refreshToken: refreshToken ?? '' }, apiUserToUser(apiUser));
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

export function useCreateBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      bankName: string;
      accountHolderName: string;
      accountNumber: string;
      iban?: string;
      branchName?: string;
    }) => createBankAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccounts });
    },
  });
}
