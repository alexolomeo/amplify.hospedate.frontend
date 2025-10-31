export type ReasonGroupKey =
  | 'noLongerCanHost'
  | 'cannotHost'
  | 'expectedMoreFromHost'
  | 'expectedMoreFromGuests'
  | 'expectedToEarnMoreMoney'
  | 'duplicateSpace';

export type ReasonCode =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27;

export type ReasonItem = {
  code: ReasonCode;
  id: string;
  name: ReasonGroupKey;
  label: string;
};

export type DeleteSpaceDict = {
  question: string;
  noLongerCanHost: {
    title: string;
    reasons: {
      noPropertyToAnnounce: string;
      legallyCannotHost: string;
      neighborsDifficulty: string;
      lifestyleChange: string;
      otherReason: string;
    };
  };
  cannotHost: {
    title: string;
    reasons: {
      hostOccasionally: string;
      renovatingOrImproving: string;
      needToPrepareProperty: string;
      otherReason: string;
    };
  };
  expectedMoreFromHost: {
    title: string;
    reasons: {
      betterService: string;
      noFairTreatment: string;
      moreSupportResources: string;
      improvePolicies: string;
      otherReason: string;
    };
  };
  expectedMoreFromGuests: {
    title: string;
    reasons: {
      noHouseRulesRespect: string;
      damagedOrStoleProperty: string;
      frequentCancellations: string;
      rudeOrDemandingGuests: string;
      unfairComments: string;
      otherReason: string;
    };
  };
  expectedToEarnMoreMoney: {
    title: string;
    reasons: {
      propertyManagementComplicated: string;
      taxManagementComplicated: string;
      localRegistrationCumbersome: string;
      expectedMoreBookings: string;
      expectedMoreIncome: string;
      otherReason: string;
    };
  };
  duplicateSpace: {
    title: string;
    reason: string;
  };
};

type ReasonSpec<
  G extends ReasonGroupKey,
  C extends ReasonCode,
  K extends string,
> = {
  code: C;
  id: string;
  name: G;
  reasonKey: K;
};

const NO_LONGER_CAN_HOST_SPECS = [
  {
    code: 1,
    id: 'reason-no-property',
    name: 'noLongerCanHost',
    reasonKey: 'noPropertyToAnnounce',
  },
  {
    code: 2,
    id: 'reason-legally',
    name: 'noLongerCanHost',
    reasonKey: 'legallyCannotHost',
  },
  {
    code: 3,
    id: 'reason-neighbors',
    name: 'noLongerCanHost',
    reasonKey: 'neighborsDifficulty',
  },
  {
    code: 4,
    id: 'reason-lifestyle',
    name: 'noLongerCanHost',
    reasonKey: 'lifestyleChange',
  },
  {
    code: 5,
    id: 'reason-other',
    name: 'noLongerCanHost',
    reasonKey: 'otherReason',
  },
] as const satisfies ReadonlyArray<
  ReasonSpec<
    'noLongerCanHost',
    1 | 2 | 3 | 4 | 5,
    keyof DeleteSpaceDict['noLongerCanHost']['reasons']
  >
>;

const CANNOT_HOST_SPECS = [
  {
    code: 6,
    id: 'reason-host-occasionally',
    name: 'cannotHost',
    reasonKey: 'hostOccasionally',
  },
  {
    code: 7,
    id: 'reason-renovating',
    name: 'cannotHost',
    reasonKey: 'renovatingOrImproving',
  },
  {
    code: 8,
    id: 'reason-prepare-property',
    name: 'cannotHost',
    reasonKey: 'needToPrepareProperty',
  },
  {
    code: 9,
    id: 'reason-other-cannot-host',
    name: 'cannotHost',
    reasonKey: 'otherReason',
  },
] as const satisfies ReadonlyArray<
  ReasonSpec<
    'cannotHost',
    6 | 7 | 8 | 9,
    keyof DeleteSpaceDict['cannotHost']['reasons']
  >
>;

const EXPECTED_MORE_FROM_HOST_SPECS = [
  {
    code: 10,
    id: 'reason-better-service',
    name: 'expectedMoreFromHost',
    reasonKey: 'betterService',
  },
  {
    code: 11,
    id: 'reason-no-fair-treatment',
    name: 'expectedMoreFromHost',
    reasonKey: 'noFairTreatment',
  },
  {
    code: 12,
    id: 'reason-more-support',
    name: 'expectedMoreFromHost',
    reasonKey: 'moreSupportResources',
  },
  {
    code: 13,
    id: 'reason-improve-policies',
    name: 'expectedMoreFromHost',
    reasonKey: 'improvePolicies',
  },
  {
    code: 14,
    id: 'reason-other-host',
    name: 'expectedMoreFromHost',
    reasonKey: 'otherReason',
  },
] as const satisfies ReadonlyArray<
  ReasonSpec<
    'expectedMoreFromHost',
    10 | 11 | 12 | 13 | 14,
    keyof DeleteSpaceDict['expectedMoreFromHost']['reasons']
  >
>;

const EXPECTED_TO_EARN_MORE_MONEY_SPECS = [
  {
    code: 15,
    id: 'reason-management-complicated',
    name: 'expectedToEarnMoreMoney',
    reasonKey: 'propertyManagementComplicated',
  },
  {
    code: 16,
    id: 'reason-tax-complicated',
    name: 'expectedToEarnMoreMoney',
    reasonKey: 'taxManagementComplicated',
  },
  {
    code: 17,
    id: 'reason-registration-cumbersome',
    name: 'expectedToEarnMoreMoney',
    reasonKey: 'localRegistrationCumbersome',
  },
  {
    code: 18,
    id: 'reason-expected-more-bookings',
    name: 'expectedToEarnMoreMoney',
    reasonKey: 'expectedMoreBookings',
  },
  {
    code: 19,
    id: 'reason-expected-more-income',
    name: 'expectedToEarnMoreMoney',
    reasonKey: 'expectedMoreIncome',
  },
  {
    code: 20,
    id: 'reason-other-money',
    name: 'expectedToEarnMoreMoney',
    reasonKey: 'otherReason',
  },
] as const satisfies ReadonlyArray<
  ReasonSpec<
    'expectedToEarnMoreMoney',
    15 | 16 | 17 | 18 | 19 | 20,
    keyof DeleteSpaceDict['expectedToEarnMoreMoney']['reasons']
  >
>;

const EXPECTED_MORE_FROM_GUESTS_SPECS = [
  {
    code: 21,
    id: 'reason-no-house-rules',
    name: 'expectedMoreFromGuests',
    reasonKey: 'noHouseRulesRespect',
  },
  {
    code: 22,
    id: 'reason-damaged-stole',
    name: 'expectedMoreFromGuests',
    reasonKey: 'damagedOrStoleProperty',
  },
  {
    code: 23,
    id: 'reason-frequent-cancellations',
    name: 'expectedMoreFromGuests',
    reasonKey: 'frequentCancellations',
  },
  {
    code: 24,
    id: 'reason-rude-demanding',
    name: 'expectedMoreFromGuests',
    reasonKey: 'rudeOrDemandingGuests',
  },
  {
    code: 25,
    id: 'reason-unfair-comments',
    name: 'expectedMoreFromGuests',
    reasonKey: 'unfairComments',
  },
  {
    code: 26,
    id: 'reason-other-guests',
    name: 'expectedMoreFromGuests',
    reasonKey: 'otherReason',
  },
] as const satisfies ReadonlyArray<
  ReasonSpec<
    'expectedMoreFromGuests',
    21 | 22 | 23 | 24 | 25 | 26,
    keyof DeleteSpaceDict['expectedMoreFromGuests']['reasons']
  >
>;

type DuplicateSpec = {
  code: 27;
  id: 'reason-duplicate-space';
  name: 'duplicateSpace';
};
const DUPLICATE_SPACE_SPECS = [
  { code: 27, id: 'reason-duplicate-space', name: 'duplicateSpace' },
] as const satisfies ReadonlyArray<DuplicateSpec>;

function materializeNoLongerCanHost(
  dict: DeleteSpaceDict['noLongerCanHost']
): ReasonItem[] {
  const { reasons } = dict;
  return NO_LONGER_CAN_HOST_SPECS.map((s) => ({
    code: s.code,
    id: s.id,
    name: s.name,
    label: reasons[s.reasonKey],
  }));
}

function materializeCannotHost(
  dict: DeleteSpaceDict['cannotHost']
): ReasonItem[] {
  const { reasons } = dict;
  return CANNOT_HOST_SPECS.map((s) => ({
    code: s.code,
    id: s.id,
    name: s.name,
    label: reasons[s.reasonKey],
  }));
}

function materializeExpectedMoreFromHost(
  dict: DeleteSpaceDict['expectedMoreFromHost']
): ReasonItem[] {
  const { reasons } = dict;
  return EXPECTED_MORE_FROM_HOST_SPECS.map((s) => ({
    code: s.code,
    id: s.id,
    name: s.name,
    label: reasons[s.reasonKey],
  }));
}

function materializeExpectedToEarnMoreMoney(
  dict: DeleteSpaceDict['expectedToEarnMoreMoney']
): ReasonItem[] {
  const { reasons } = dict;
  return EXPECTED_TO_EARN_MORE_MONEY_SPECS.map((s) => ({
    code: s.code,
    id: s.id,
    name: s.name,
    label: reasons[s.reasonKey],
  }));
}

function materializeExpectedMoreFromGuests(
  dict: DeleteSpaceDict['expectedMoreFromGuests']
): ReasonItem[] {
  const { reasons } = dict;
  return EXPECTED_MORE_FROM_GUESTS_SPECS.map((s) => ({
    code: s.code,
    id: s.id,
    name: s.name,
    label: reasons[s.reasonKey],
  }));
}

function materializeDuplicate(
  dict: DeleteSpaceDict['duplicateSpace']
): ReasonItem[] {
  return DUPLICATE_SPACE_SPECS.map((s) => ({
    code: s.code,
    id: s.id,
    name: s.name,
    label: dict.reason,
  }));
}

export function buildDeleteReasons(
  dict: DeleteSpaceDict
): Record<ReasonGroupKey, ReasonItem[]> {
  return {
    noLongerCanHost: materializeNoLongerCanHost(dict.noLongerCanHost),
    cannotHost: materializeCannotHost(dict.cannotHost),
    expectedMoreFromHost: materializeExpectedMoreFromHost(
      dict.expectedMoreFromHost
    ),
    expectedToEarnMoreMoney: materializeExpectedToEarnMoreMoney(
      dict.expectedToEarnMoreMoney
    ),
    expectedMoreFromGuests: materializeExpectedMoreFromGuests(
      dict.expectedMoreFromGuests
    ),
    duplicateSpace: materializeDuplicate(dict.duplicateSpace),
  };
}
