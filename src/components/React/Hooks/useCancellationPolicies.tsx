import type { translate } from '@/utils/i18n';
import { useMemo } from 'react';

//
// Types
//
export type PolicyType = 'STANDARD' | 'LONG_TERM';
export type StandardPolicyId = 'flexible' | 'moderate' | 'firm' | 'strict';
export type LongStayPolicyId = 'firm' | 'strict';

export interface PolicyItem<T extends string> {
  id: T;
  label: string;
  description: string;
}

//
// Hook to build arrays from translations
//
export function useCancellationPolicies(t: ReturnType<typeof translate>) {
  const STANDARD_POLICIES: ReadonlyArray<PolicyItem<StandardPolicyId>> =
    useMemo(
      () =>
        ['flexible', 'moderate', 'firm', 'strict'].map((key) => ({
          id: key as StandardPolicyId,
          label:
            t.hostContent.editListing.content.cancellationPolicy.standardPolicy[
              key
            ].label,
          description:
            t.hostContent.editListing.content.cancellationPolicy.standardPolicy[
              key
            ].description,
        })),
      [t]
    );

  const LONG_STAY_POLICIES: ReadonlyArray<PolicyItem<LongStayPolicyId>> =
    useMemo(
      () =>
        ['firm', 'strict'].map((key) => ({
          id: key as LongStayPolicyId,
          label:
            t.hostContent.editListing.content.cancellationPolicy.longTermPolicy[
              key
            ].label,
          description:
            t.hostContent.editListing.content.cancellationPolicy.longTermPolicy[
              key
            ].description,
        })),
      [t]
    );

  const fallback: PolicyItem<'unknown'> = {
    id: 'unknown',
    label: t.common.unknown,
    description: t.common.unknownDescription,
  };

  return { STANDARD_POLICIES, LONG_STAY_POLICIES, fallback };
}

//
// External helper (pure function)
//
export function getPolicy(
  policyType: PolicyType,
  policyName: string,
  standardPolicies: ReadonlyArray<PolicyItem<StandardPolicyId>>,
  longTermPolicies: ReadonlyArray<PolicyItem<LongStayPolicyId>>,
  fallback: PolicyItem<'unknown'>
): PolicyItem<StandardPolicyId | LongStayPolicyId | 'unknown'> {
  const list = policyType === 'STANDARD' ? standardPolicies : longTermPolicies;

  return list.find((p) => p.id === policyName.toLowerCase()) ?? fallback;
}
