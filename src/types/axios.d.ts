/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig<D = any> {
    /** When true, the global 404 redirect will be skipped for this request */
    skipGlobal404Redirect?: boolean;
  }

  export interface InternalAxiosRequestConfig<D = any> {
    /** When true, the global 404 redirect will be skipped for this request */
    skipGlobal404Redirect?: boolean;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
/* eslint-enable @typescript-eslint/no-explicit-any */
