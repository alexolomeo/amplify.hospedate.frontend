import ListingCancellationPolicy from '@/components/React/Listing/ListingCancellationPolicy';
import ModalCancellationPolicy from '@/components/React/Listing/ModalCancellationPolicy';
import { RuleType } from '@/types/enums/ruleType';
import type { CancellationPolicy } from '@/types/listing/cancellationPolicy';
import { getTranslation } from '@/utils/i18n';
import { screen, render } from '@testing-library/react';
import { parseISO } from 'date-fns';

const mockCancellationPolicy: CancellationPolicy = {
  name: 'Firm',
  policyType: 'STANDARD',
  summaryKey: 'cancellation_policy_standard_firm_summary',
  summaryPlaceholders: {
    deadline1: '2025-05-02T08:00:00',
    deadline2: '2025-05-18T08:00:00',
    deadline3: '2025-05-25T08:00:00',
    bookingWindowHours: 48,
    refundPercentage: 50,
  },
  rules: [
    {
      ruleType: RuleType.CheckInBased,
      deadline: '2025-05-02T08:00:00',
      bookingWindowHours: 0,
      refund: {
        percentage: 100,
        includeServiceFee: true,
      },
      nonRefundableNights: 0,
      descriptionKey: 'cancellation_policy_standard_rule_firm_full_refund',
      descriptionPlaceholders: {
        deadline: '2025-05-02T08:00:00',
      },
    },
    {
      ruleType: RuleType.BookingBased,
      deadline: '2025-05-18T08:00:00',
      bookingWindowHours: 48,
      refund: {
        percentage: 100,
        includeServiceFee: true,
      },
      nonRefundableNights: 0,
      descriptionKey:
        'cancellation_policy_standard_rule_firm_full_refund_booking_window',
      descriptionPlaceholders: {
        deadline: '2025-05-18T08:00:00',
        bookingWindowHours: 48,
      },
    },
    {
      ruleType: RuleType.CheckInBased,
      deadline: '2025-05-25T08:00:00',
      bookingWindowHours: 0,
      refund: {
        percentage: 50,
        includeServiceFee: false,
      },
      nonRefundableNights: 0,
      descriptionKey: 'cancellation_policy_standard_rule_firm_partial_refund',
      descriptionPlaceholders: {
        deadline: '2025-05-25T08:00:00',
        refundPercentage: 50,
      },
    },
    {
      ruleType: RuleType.CheckInBased,
      deadline: '2025-06-01T08:00:00',
      bookingWindowHours: 0,
      refund: {
        percentage: 0,
        includeServiceFee: false,
      },
      nonRefundableNights: 0,
      descriptionKey: 'cancellation_policy_standard_rule_firm_no_refund',
      descriptionPlaceholders: {
        deadline: '2025-06-01T08:00:00',
      },
    },
  ],
};
const t = getTranslation('es');

it('should render the modal title, description, and more info button correctly', () => {
  render(
    <ModalCancellationPolicy
      cancellationPolicy={mockCancellationPolicy}
      checkIn={new Date()}
      lang="es"
      nights={6}
      today={new Date()}
    />
  );
  expect(
    screen.getByText(t.listingDetail.thingsToKnow.cancellationPolicy.title)
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      t.listingDetail.thingsToKnow.cancellationPolicy.description
    )
  ).toBeInTheDocument();
  expect(
    screen.getByTestId('button-cancellation-policy-more-info')
  ).toBeInTheDocument();
});

it('should render correct "before" and "after" labels for each deadline', () => {
  render(
    <ModalCancellationPolicy
      cancellationPolicy={mockCancellationPolicy}
      checkIn={parseISO('2025-05-25')}
      lang="es"
      nights={6}
      today={new Date()}
    />
  );
  expect(
    screen.getAllByText(t.listingDetail.thingsToKnow.cancellationPolicy.after)
  ).toHaveLength(1);
});

it('should render summaryText correctly based on cancellationPolicy', () => {
  render(
    <ListingCancellationPolicy
      cancellationPolicy={mockCancellationPolicy}
      checkIn={new Date('2024-05-28')}
      checkout={new Date()}
      lang="es"
      isFormValid={true}
      today={new Date()}
    />
  );
  expect(
    screen.getByTestId(mockCancellationPolicy.summaryKey)
  ).toBeInTheDocument();
  expect(
    screen.getByTestId('button-cancellation-policy-know-more')
  ).toBeInTheDocument();
});

it('should not render summaryText if isDateRangeValid or isGuestCountValid is false', () => {
  render(
    <ListingCancellationPolicy
      cancellationPolicy={mockCancellationPolicy}
      checkIn={new Date()}
      checkout={new Date()}
      lang="es"
      isFormValid={false}
      today={new Date()}
    />
  );
  expect(
    screen.getByText(
      t.listingDetail.thingsToKnow.cancellationPolicy.addDateMessage
    )
  ).toBeInTheDocument();
  expect(
    screen.getByTestId('button-cancellation-policy-add-date')
  ).toBeInTheDocument();
});
