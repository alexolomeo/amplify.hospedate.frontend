import api from '@/utils/api';

export interface BankAccount {
  id: number;
  alias: string;
  bankName: string;
  accountNumber: string;
}

export interface PaymentsResponse {
  payoutInfo: {
    bankAccounts: BankAccount[];
  };
}

export async function getPayments(
  signal?: AbortSignal
): Promise<PaymentsResponse> {
  const { data } = await api.get<PaymentsResponse>(
    '/account-settings/payments',
    {
      signal,
    }
  );
  return data;
}
