import type { RuleType } from '../enums/ruleType';

export interface CancellationPolicy {
  name: string;
  policyType: string;
  summaryKey: string;
  summaryPlaceholders: SummaryPlaceholders;
  rules: Rule[];
}

export interface SummaryPlaceholders {
  bookingWindowHours?: number;
  deadline?: string;
  deadline1?: string;
  deadline2?: string;
  deadline3?: string;
  refundPercentage?: number;
  nonRefundableNights?: number;
}

export interface Rule {
  bookingWindowHours: number;
  deadline: string;
  descriptionKey: string;
  descriptionPlaceholders: DescriptionPlaceholders;
  nonRefundableNights: number;
  refund: Refund;
  ruleType: RuleType;
}

export interface DescriptionPlaceholders {
  bookingWindowHours?: number;
  deadline: string;
  deadline1?: string;
  deadline2?: string;
  deadline3?: string;
  refundPercentage?: number;
  nonRefundableNights?: number;
}

export interface Refund {
  includeServiceFee: boolean;
  percentage: number;
}
