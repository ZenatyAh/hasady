// src/services/api/wallet.ts

import { apiGet, apiPost } from '@/lib/api-client';
import { toApiNumber, unwrapListItems } from '@/lib/api-list';

export interface WalletSummary {
  balance: number;
  pendingBalance: number;
  withdrawableBalance: number;
  currency: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'REJECTED';
  createdAt: string;
  notes?: string;
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number | string;
  description?: string;
  createdAt: string;
}

export async function getWalletSummary(): Promise<WalletSummary> {
  const data = await apiGet<Record<string, unknown>>('/wallet');
  return {
    balance: toApiNumber(data.balance),
    pendingBalance: toApiNumber(data.pendingBalance),
    withdrawableBalance: toApiNumber(data.withdrawableBalance),
    currency: typeof data.currency === 'string' ? data.currency : 'ريال سعودي',
  };
}

export async function getWithdrawalRequests(): Promise<WithdrawalRequest[]> {
  const data = await apiGet<unknown>('/wallet/withdrawals');
  return unwrapListItems<WithdrawalRequest>(data);
}

export async function createWithdrawalRequest(
  amount: number,
  notes: string
): Promise<WithdrawalRequest> {
  return apiPost('/wallet/withdraw', { amount, notes });
}

export async function getWalletTransactions(): Promise<WalletTransaction[]> {
  const data = await apiGet<unknown>('/wallet/transactions');
  return unwrapListItems<WalletTransaction>(data);
}

export { getBankAccounts, getDefaultBankAccount } from '@/services/api/bank-accounts';
export type { BankAccount } from '@/services/api/bank-accounts';
