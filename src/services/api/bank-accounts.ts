import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api-client';
import { unwrapListItems } from '@/lib/api-list';

export interface BankAccount {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  iban?: string | null;
  branchName?: string | null;
  isDefault?: boolean;
}

export async function getBankAccounts(): Promise<BankAccount[]> {
  const data = await apiGet<unknown>('/bank-accounts');
  return unwrapListItems<BankAccount>(data);
}

export async function getDefaultBankAccount(): Promise<BankAccount | null> {
  const accounts = await getBankAccounts();
  return accounts.find((a) => a.isDefault) ?? accounts[0] ?? null;
}

export async function createBankAccount(payload: {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  iban?: string;
  branchName?: string;
}): Promise<BankAccount> {
  return apiPost('/bank-accounts', payload);
}

export async function updateBankAccount(
  id: string,
  payload: Partial<{
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
    iban: string;
    branchName: string;
  }>
): Promise<BankAccount> {
  return apiPatch(`/bank-accounts/${id}`, payload);
}

export async function setDefaultBankAccount(id: string): Promise<BankAccount> {
  return apiPatch(`/bank-accounts/${id}/default`, {});
}

export async function deleteBankAccount(id: string): Promise<void> {
  await apiDelete(`/bank-accounts/${id}`);
}
