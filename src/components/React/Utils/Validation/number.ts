export function isIntegerStr(s: string): boolean {
  return /^\d+$/.test(s.trim());
}
