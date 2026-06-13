import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api-client';

export interface BankAccount {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  iban?: string | null;
  branchName?: string | null;
  isDefault?: boolean;
}

export async function getBankAccounts(token?: string | null): Promise<BankAccount[]> {
  return apiGet('/bank-accounts', () => Promise.resolve([]), { token });
}

export async function createBankAccount(
  payload: {
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
    iban?: string;
    branchName?: string;
  },
  token?: string | null
): Promise<BankAccount> {
  return apiPost(
    '/bank-accounts',
    payload,
    () =>
      Promise.resolve({
        id: `bank-${Date.now()}`,
        ...payload,
        isDefault: true,
      }),
    { token }
  );
}

export async function updateBankAccount(
  id: string,
  payload: Partial<{
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
    iban?: string;
    branchName?: string;
  }>,
  token?: string | null
): Promise<BankAccount> {
  return apiPatch(
    `/bank-accounts/${id}`,
    payload,
    () =>
      Promise.resolve({
        id,
        bankName: payload.bankName ?? 'البنك',
        accountHolderName: payload.accountHolderName ?? 'حساب',
        accountNumber: payload.accountNumber ?? '0000',
        isDefault: false,
      }),
    { token }
  );
}

export async function setDefaultBankAccount(
  id: string,
  token?: string | null
): Promise<BankAccount> {
  return apiPatch(
    `/bank-accounts/${id}/default`,
    {},
    () =>
      Promise.resolve({
        id,
        bankName: 'البنك',
        accountHolderName: 'حساب',
        accountNumber: '0000',
        isDefault: true,
      }),
    { token }
  );
}

export async function deleteBankAccount(id: string, token?: string | null): Promise<void> {
  await apiDelete(`/bank-accounts/${id}`, () => Promise.resolve({}), { token });
}

export async function getDefaultBankAccount(token?: string | null): Promise<BankAccount | null> {
  const accounts = await getBankAccounts(token);
  return accounts.find((account) => account.isDefault) ?? accounts[0] ?? null;
}
