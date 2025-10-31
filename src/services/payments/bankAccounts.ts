import api from '@/utils/api';
import type { AxiosResponse } from 'axios';

export interface CreateBankAccountRequest {
  bankName: string;
  accountType: string;
  accountNumber: string;
  accountHolderName: string;
  alias: string;
}

export interface CreateBankAccountResponse {
  bankName: string;
  accountType: string;
  accountNumber: string;
  accountHolderName: string;
  alias: string;
  id?: number;
}

export async function createBankAccount(
  payload: CreateBankAccountRequest,
  signal?: AbortSignal
): Promise<CreateBankAccountResponse> {
  const res = await api.post<
    CreateBankAccountResponse,
    AxiosResponse<CreateBankAccountResponse>
  >('/account-settings/bank-accounts', payload, { signal });
  return res.data;
}

export async function deleteBankAccount(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  await api.delete(`/account-settings/bank-accounts/${id}`, { signal });
}
