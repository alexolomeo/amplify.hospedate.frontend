export type PasswordErrorCode =
  | 'tooShort'
  | 'allNumbers'
  | 'allLetters'
  | 'needsNumberOrSymbol'
  | 'containsPersonalInfo';

export interface PasswordValidateOpts {
  name?: string;
  email?: string;
}

export function validatePassword(
  value: string,
  opts: PasswordValidateOpts = {}
): PasswordErrorCode | null {
  if (!value || value.length < 8) return 'tooShort';
  if (/^\d+$/.test(value)) return 'allNumbers';
  if (/^[a-zA-Z]+$/.test(value)) return 'allLetters';
  if (!/\d|[^a-zA-Z0-9]/.test(value)) return 'needsNumberOrSymbol';

  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');

  const pwd = norm(value);
  const nm = norm(opts.name ?? '');
  const user = norm((opts.email ?? '').split('@')[0]);

  if (nm.length >= 3 && pwd.includes(nm)) return 'containsPersonalInfo';
  if (user.length >= 3 && pwd.includes(user)) return 'containsPersonalInfo';
  return null;
}
