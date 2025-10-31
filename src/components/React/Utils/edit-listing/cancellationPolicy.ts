export type StandardPolicyId = '1' | '2' | '3' | '4';
export type LongStayPolicyId = '5' | '6';
export type CancellationPolicyId = StandardPolicyId | LongStayPolicyId;

export const STANDARD_POLICY_IDS: Readonly<StandardPolicyId[]> = [
  '1',
  '2',
  '3',
  '4',
] as const;
export const LONG_STAY_POLICY_IDS: Readonly<LongStayPolicyId[]> = [
  '5',
  '6',
] as const;

export const isValidStandard = (v: unknown): v is StandardPolicyId =>
  typeof v === 'string' &&
  (STANDARD_POLICY_IDS as readonly string[]).includes(v);
export const isValidLongStay = (v: unknown): v is LongStayPolicyId =>
  typeof v === 'string' &&
  (LONG_STAY_POLICY_IDS as readonly string[]).includes(v);
