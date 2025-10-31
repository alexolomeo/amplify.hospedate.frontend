import api from '@/utils/api';
import type { AxiosResponse } from 'axios';

export interface BankCatalog {
  id: string;
  name: string;
}
export interface AccountTypeCatalog {
  id: string;
  name: string;
}
export interface CatalogsResponse {
  banks: BankCatalog[];
  accountTypes: AccountTypeCatalog[];
}

export async function getPaymentCatalogs(
  signal?: AbortSignal
): Promise<CatalogsResponse> {
  const res = await api.get<CatalogsResponse, AxiosResponse<CatalogsResponse>>(
    '/account-settings/payments/catalogs',
    {
      signal,
    }
  );
  return res.data;
}
