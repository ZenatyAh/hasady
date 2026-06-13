// src/services/api/wallet.ts

import { apiGet, apiPost } from '@/lib/api-client';

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

export interface WalletSummary {
  balance: number; // Available/Total
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

const DEFAULT_WALLET: WalletSummary = {
  balance: 5200,
  pendingBalance: 2000,
  withdrawableBalance: 3200,
  currency: 'ريال سعودي',
};

const DEFAULT_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'req-1',
    amount: 2000,
    currency: 'ريال سعودي',
    status: 'PENDING',
    createdAt: '14-09-2025',
    notes: 'سحب مستحقات النصف الأول من سبتمبر',
  },
  {
    id: 'req-2',
    amount: 2000,
    currency: 'ريال سعودي',
    status: 'PENDING',
    createdAt: '14-09-2025',
  },
  {
    id: 'req-3',
    amount: 2000,
    currency: 'ريال سعودي',
    status: 'SUCCESS',
    createdAt: '14-09-2025',
  },
  {
    id: 'req-4',
    amount: 2000,
    currency: 'ريال سعودي',
    status: 'REJECTED',
    createdAt: '14-09-2025',
  },
  {
    id: 'req-5',
    amount: 2000,
    currency: 'ريال سعودي',
    status: 'PENDING',
    createdAt: '14-09-2025',
  },
  {
    id: 'req-6',
    amount: 2000,
    currency: 'ريال سعودي',
    status: 'SUCCESS',
    createdAt: '14-09-2025',
  },
];

// Helper functions for SessionStorage persistence
function getStoredWallet(): WalletSummary {
  if (typeof window === 'undefined') return DEFAULT_WALLET;
  const stored = sessionStorage.getItem('hasady-wallet');
  if (stored) {
    try {
      return JSON.parse(stored) as WalletSummary;
    } catch {
      return DEFAULT_WALLET;
    }
  }
  sessionStorage.setItem('hasady-wallet', JSON.stringify(DEFAULT_WALLET));
  return DEFAULT_WALLET;
}

function saveStoredWallet(wallet: WalletSummary): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('hasady-wallet', JSON.stringify(wallet));
  }
}

function getStoredWithdrawals(): WithdrawalRequest[] {
  if (typeof window === 'undefined') return DEFAULT_WITHDRAWALS;
  const stored = sessionStorage.getItem('hasady-withdrawals');
  if (stored) {
    try {
      return JSON.parse(stored) as WithdrawalRequest[];
    } catch {
      return DEFAULT_WITHDRAWALS;
    }
  }
  sessionStorage.setItem('hasady-withdrawals', JSON.stringify(DEFAULT_WITHDRAWALS));
  return DEFAULT_WITHDRAWALS;
}

function saveStoredWithdrawals(requests: WithdrawalRequest[]): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('hasady-withdrawals', JSON.stringify(requests));
  }
}

// API Methods
export async function getWalletSummary(token?: string | null): Promise<WalletSummary> {
  return apiGet(
    '/wallet',
    () =>
      mockDelay(() => {
        return getStoredWallet();
      }),
    { token }
  );
}

export async function getWithdrawalRequests(token?: string | null): Promise<WithdrawalRequest[]> {
  return apiGet(
    '/wallet/withdrawals',
    () =>
      mockDelay(() => {
        return getStoredWithdrawals();
      }),
    { token }
  );
}

export async function createWithdrawalRequest(
  amount: number,
  notes: string,
  token?: string | null
): Promise<WithdrawalRequest> {
  return apiPost(
    '/wallet/withdraw',
    { amount, notes },
    () =>
      mockDelay(() => {
        const wallet = getStoredWallet();
        if (amount > wallet.withdrawableBalance) {
          throw new Error('الرصيد المتاح للسحب غير كافٍ');
        }

        // Deduct balance
        const updatedWallet: WalletSummary = {
          ...wallet,
          withdrawableBalance: wallet.withdrawableBalance - amount,
          balance: wallet.balance - amount,
        };
        saveStoredWallet(updatedWallet);

        const newRequest: WithdrawalRequest = {
          id: `req-${Date.now()}`,
          amount,
          currency: 'ريال سعودي',
          status: 'PENDING',
          createdAt: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
          notes,
        };

        const currentRequests = getStoredWithdrawals();
        const updatedRequests = [newRequest, ...currentRequests];
        saveStoredWithdrawals(updatedRequests);

        return newRequest;
      }),
    { token }
  );
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number | string;
  description?: string;
  createdAt: string;
}

export async function getWalletTransactions(token?: string | null): Promise<WalletTransaction[]> {
  return apiGet(
    '/wallet/transactions',
    () =>
      mockDelay(() => [
        {
          id: 'tx-1',
          type: 'CREDIT',
          amount: 1000,
          description: 'إيداع',
          createdAt: new Date().toISOString(),
        },
      ]),
    { token }
  );
}

export { getBankAccounts, getDefaultBankAccount } from '@/services/api/bank-accounts';
export type { BankAccount } from '@/services/api/bank-accounts';
