interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
  readonly PUBLIC_APP_URL: string;
  readonly ACCESS_TOKEN_LIFETIME_IN_MINUTES: number;
  readonly PUBLIC_GOOGLE_MAPS_API_KEY: string;
  readonly PUBLIC_GOOGLE_MAPS_MAP_ID: string;
  readonly PUBLIC_APP_DEEP_LINK_BASE: string;
  readonly PUBLIC_ABLY_API_KEY: string;
  readonly PUBLIC_FIREBASE_API_KEY: string;
  readonly PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  readonly PUBLIC_FIREBASE_PROJECT_ID: string;
  readonly PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  readonly PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly PUBLIC_FIREBASE_APP_ID: string;
  readonly PUBLIC_FIREBASE_VAPID_KEY: string;
  readonly PUBLIC_FIREBASE_MEASUREMENT_ID: string;
  readonly PUBLIC_ENABLE_WEB_PUSH: string; // 'true' or 'any other string'
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
