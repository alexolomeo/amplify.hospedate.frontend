export interface KycSession {
  id: string;
  token: string;
  qrCode: string;
  expiresAt: string;
}

export const toDataUrl = (b64: string): string =>
  b64.startsWith('data:') ? b64 : `data:image/png;base64,${b64}`;

export const isSessionValid = (s: KycSession | null): boolean =>
  !!s && new Date(s.expiresAt).getTime() > Date.now();
