import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import api from '@/utils/api';

import {
  getPayments,
  type PaymentsResponse,
} from '@/services/payments/payments';

import {
  getPaymentCatalogs,
  type CatalogsResponse,
} from '@/services/payments/catalogs';

import {
  createBankAccount,
  deleteBankAccount,
  type CreateBankAccountRequest,
  type CreateBankAccountResponse,
} from '@/services/payments/bankAccounts';

function axiosOk<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  };
}

describe('Payments API services', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getPayments llama al endpoint correcto y retorna los datos', async () => {
    const mockData: PaymentsResponse = {
      payoutInfo: {
        bankAccounts: [
          {
            id: 37,
            alias: 'Mi cuenta preferida',
            bankName: 'BANCO UNION',
            accountNumber: '****3006',
          },
        ],
      },
    };

    const spy = vi
      .spyOn(api, 'get')
      .mockResolvedValue(axiosOk<PaymentsResponse>(mockData));

    const controller = new AbortController();
    const res = await getPayments(controller.signal);

    expect(spy).toHaveBeenCalledWith('/account-settings/payments', {
      signal: controller.signal,
    });
    expect(res).toEqual(mockData);
  });

  it('getPaymentCatalogs llama al endpoint correcto y retorna catálogos', async () => {
    const mockData: CatalogsResponse = {
      banks: [
        { id: 'BCP', name: 'coepi' },
        { id: 'MERCANTIL', name: 'officia' },
      ],
      accountTypes: [
        { id: 'CHECKING', name: 'alveus' },
        { id: 'SAVING', name: 'defero' },
      ],
    };

    const spy = vi
      .spyOn(api, 'get')
      .mockResolvedValue(axiosOk<CatalogsResponse>(mockData));

    const controller = new AbortController();
    const res = await getPaymentCatalogs(controller.signal);

    expect(spy).toHaveBeenCalledWith('/account-settings/payments/catalogs', {
      signal: controller.signal,
    });
    expect(res).toEqual(mockData);
  });

  it('createBankAccount hace POST con el payload y devuelve la cuenta creada', async () => {
    const payload: CreateBankAccountRequest = {
      bankName: 'BCP',
      accountType: 'SAVING',
      accountNumber: '1234567890',
      accountHolderName: 'Juan Pérez',
      alias: 'Mi cuenta BCP',
    };

    const created: CreateBankAccountResponse = {
      ...payload,
      id: 99,
    };

    const spy = vi
      .spyOn(api, 'post')
      .mockResolvedValue(axiosOk<CreateBankAccountResponse>(created));

    const res = await createBankAccount(payload);

    expect(spy).toHaveBeenCalledWith(
      '/account-settings/bank-accounts',
      payload,
      { signal: undefined }
    );
    expect(res).toEqual(created);
  });

  it('deleteBankAccount hace DELETE al recurso por id', async () => {
    const spy = vi
      .spyOn(api, 'delete')
      .mockResolvedValue(axiosOk<void>(undefined));

    const controller = new AbortController();
    await deleteBankAccount(37, controller.signal);

    expect(spy).toHaveBeenCalledWith('/account-settings/bank-accounts/37', {
      signal: controller.signal,
    });
  });
});
