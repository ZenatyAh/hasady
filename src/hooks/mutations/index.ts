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

export function usePlaceOrder(token?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      productId: string;
      offeredPrice: number;
      quantity: number;
      notes?: string;
    }) => placeOrder(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myOrders });
    },
  });
}

export function usePlaceBid(token?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { productId: string; amount: number }) => placeBid(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market'] });
    },
  });
}

export function useAcceptOrder(token?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => acceptOrder(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingOrders });
    },
  });
}

export function useRejectOrder(token?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectOrder(id, reason, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingOrders });
    },
  });
}

export function useConfirmDelivery(token?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmDelivery(id, token),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myOrders });
      queryClient.invalidateQueries({ queryKey: queryKeys.order(id) });
    },
  });
}

export function useCancelOrder(token?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelOrder(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myOrders });
    },
  });
}

export function useUpdateOrderStatus(token?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(id, status, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingOrders });
    },
  });
}

export function useInitiatePayment(token?: string | null) {
  return useMutation({
    mutationFn: (orderId: string) => initiatePayment(orderId, token),
  });
}

export function useCreateRating(token?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { orderId: string; score: number; comment?: string }) =>
      createRating(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ratingsGiven });
      queryClient.invalidateQueries({ queryKey: queryKeys.ratingsReceived });
    },
  });
}

export function useMarkAllNotificationsRead(token?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
  });
}

export function useUpdateProfile(token?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { fullName?: string; bio?: string; phone?: string }) =>
      updateMe(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

export function usePromoteToMerchant(token?: string | null) {
  return useMutation({
    mutationFn: () => promoteToMerchant(token),
  });
}

export function useCreateBankAccount(token?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      bankName: string;
      accountHolderName: string;
      accountNumber: string;
      iban?: string;
      branchName?: string;
    }) => createBankAccount(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccounts });
    },
  });
}
