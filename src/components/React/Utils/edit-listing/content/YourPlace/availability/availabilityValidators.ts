import { isIntegerStr } from '@/components/React/Utils/Validation/number';

export const MIN_NIGHTS_MIN = 1 as const;
export const MAX_NIGHTS_MAX = 730 as const;

export type NoticeKey =
  | 'SAME_DAY'
  | 'AT_LEAST_ONE_DAY'
  | 'AT_LEAST_TWO_DAYS'
  | 'AT_LEAST_THREE_DAYS'
  | 'AT_LEAST_SEVEN_DAYS';

export type AvailabilityForm = {
  minNightsRaw: string;
  maxNightsRaw: string;
  noticeKey: NoticeKey | null;
  sameDayCutoffLabel: string | null;
  allowRequestSameDay: boolean;
};

export type AvailabilityFieldErrors = Partial<{
  minNightsRaw: string;
  maxNightsRaw: string;
  sameDayCutoffLabel: string;
}>;

export type AvailabilityValidationResult =
  | { ok: true }
  | { ok: false; errors: AvailabilityFieldErrors };

export type AvailabilityValidationMessages = {
  tripDuration: {
    integerOnly: string;
    min: {
      required: string;
      atLeast1: string;
      lteMax: (max: number) => string;
    };
    max: {
      required: string;
      gteMin: (min: number) => string;
      lte730: string;
    };
  };
  notice: {
    cutoffRequired: string;
  };
};

export function validateAvailabilityForm(
  form: AvailabilityForm,
  m: AvailabilityValidationMessages
): AvailabilityValidationResult {
  const errors: AvailabilityFieldErrors = {};

  // ---- minNights
  if (form.minNightsRaw.trim() === '') {
    errors.minNightsRaw = m.tripDuration.min.required;
  } else if (!isIntegerStr(form.minNightsRaw)) {
    errors.minNightsRaw = m.tripDuration.integerOnly;
  } else if (Number(form.minNightsRaw) < MIN_NIGHTS_MIN) {
    errors.minNightsRaw = m.tripDuration.min.atLeast1;
  }

  // ---- maxNights
  if (form.maxNightsRaw.trim() === '') {
    errors.maxNightsRaw = m.tripDuration.max.required;
  } else if (!isIntegerStr(form.maxNightsRaw)) {
    errors.maxNightsRaw = m.tripDuration.integerOnly;
  } else if (Number(form.maxNightsRaw) > MAX_NIGHTS_MAX) {
    errors.maxNightsRaw = m.tripDuration.max.lte730;
  }

  if (!errors.minNightsRaw && !errors.maxNightsRaw) {
    const min = Number(form.minNightsRaw);
    const max = Number(form.maxNightsRaw);
    if (min > max) {
      errors.minNightsRaw = m.tripDuration.min.lteMax(max);
      errors.maxNightsRaw = m.tripDuration.max.gteMin(min);
    }
  }

  // ---- notice (opcional)
  if (form.noticeKey === 'SAME_DAY') {
    if (!form.sameDayCutoffLabel || form.sameDayCutoffLabel.trim() === '') {
      errors.sameDayCutoffLabel = m.notice.cutoffRequired;
    }
  }

  return Object.keys(errors).length === 0
    ? { ok: true }
    : { ok: false, errors };
}
