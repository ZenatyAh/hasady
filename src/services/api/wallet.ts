// src/services/api/wallet.ts

import { apiGet, apiPost } from '@/lib/api-client';

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
  return apiGet('/wallet');
}

export async function getWithdrawalRequests(): Promise<WithdrawalRequest[]> {
  return apiGet('/wallet/withdrawals');
}

export async function createWithdrawalRequest(
  amount: number,
  notes: string
): Promise<WithdrawalRequest> {
  return apiPost('/wallet/withdraw', { amount, notes });
}

export async function getWalletTransactions(): Promise<WalletTransaction[]> {
  return apiGet('/wallet/transactions');
}

export { getBankAccounts, getDefaultBankAccount } from '@/services/api/bank-accounts';
export type { BankAccount } from '@/services/api/bank-accounts';
