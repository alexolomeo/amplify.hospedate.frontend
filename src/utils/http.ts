import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import api from './api';

/** Post FormData keeping multipart boundary intact. */
export async function postFormData<T>(
  url: string,
  form: FormData,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return api.post<T>(url, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config,
  });
}

export function optionalArg<T extends object>(
  cond: boolean | undefined,
  cfg: T
): [] | readonly [T] {
  return cond ? ([cfg] as const) : [];
}
