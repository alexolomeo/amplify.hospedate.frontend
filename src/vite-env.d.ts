/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
  readonly INTERNAL_API_URL: string;
  readonly PUBLIC_APP_URL: string;
  readonly PUBLIC_ACCESSS_TOKEN_LIFETIME_IN_MINUTES: string;
  readonly PUBLIC_GOOGLE_MAPS_API_KEY: string;
  readonly PUBLIC_GOOGLE_MAPS_MAP_ID: string;
  readonly PUBLIC_APP_DEEP_LINK_BASE: string;
  readonly PUBLIC_ABLY_API_KEY: string;
  readonly PUBLIC_SUPPORT_EMAIL: string;
  readonly PUBLIC_SUPPORT_WHATSAPP: string;
  readonly PUBLIC_SUPPORT_WHATSAPP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob: ImportMetaGlobFunction;
}

type ImportMetaGlobFunction = {
  (globPath: string): Record<string, () => Promise<unknown>>;
  <T = unknown>(
    globPath: string,
    options: ImportGlobOptions
  ): Record<string, () => Promise<T>>;
};

interface ImportGlobOptions {
  eager?: boolean;
  as?: string;
  query?: string;
  import?: string;
  exhaustive?: boolean;
}
