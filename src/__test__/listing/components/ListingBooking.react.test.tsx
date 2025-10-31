import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { addDays } from 'date-fns';
import type {
  CalendarSettings,
  Pricing,
  UseCalendarReturn,
} from '@/types/listing/pricing';
import ListingBooking from '@/components/React/Listing/ListingBooking';
import type { Guests } from '@/types/search';
import { getTranslation } from '@/utils/i18n';

jest.mock('@/stores/userStore', () => ({
  $userStore: {
    get: jest.fn(),
    listen: jest.fn(() => () => {}),
  },
}));

jest.mock('astro/virtual-modules/transitions-router.js', () => ({
  navigate: jest.fn(),
}));

const mockCalendar: CalendarSettings = {
  availabilityWindowInDays: 730,
  minTripLength: 2,
  maxTripLength: 10,
  restrictedCheckoutDays: [5],
  restrictedCheckInDays: [0],
  advanceNoticeHours: 15,
  sameDayAdvanceNoticeTime: 18,
  allowRequestUnderAdvanceNoticeHours: false,
  preparationTimeInDays: 1,
};
const mockPricing: Pricing = {
  subtotalBeforeServiceFee: 1103,
  subtotal: 1050,
  currency: 'BOB',
  serviceFee: 35,
  weeklyDiscountAmount: 12,
  monthlyDiscountAmount: 0,
  total: 1138,
};
const mockGuestCount: Guests = {
  adults: 1,
  children: 0,
  infants: 0,
  pets: 0,
};
const today = new Date();
const week = addDays(today, 5);
const month = addDays(today, 28);
const mockCalendarReturn: UseCalendarReturn = {
  today: today,
  initialRange: undefined,
  month: month,
  setMonth: jest.fn(),
  selected: undefined,
  preparationDates: [],
  blockedDatesArray: [],
  isAboveMaxDays: jest.fn(),
  isBelowMinDays: jest.fn(),
  handleSelect: jest.fn(),
  handleReset: jest.fn(),
  disabledDays: [],
};

const baseProps = {
  calendarResult: mockCalendarReturn,
  pricing: mockPricing,
  calendarSettings: mockCalendar,
  onUpdateGuest: jest.fn(),
  onUpdateCalendar: jest.fn(),
  checkIn: new Date(),
  checkout: addDays(new Date(), 5),
  guestCount: mockGuestCount,
  lang: 'es' as const,
  city: 'Santa Cruz',
  petsAllowed: true,
  onReloadAvailability: jest.fn(),
  maxGuests: 10,
  isDateRangeValid: true,
  isGuestCountValid: true,
  onUpdateDataRangeValid: jest.fn(),
  isLoading: false,
  listingId: 1,
  isError: false,
  isAvailable: true,
};

describe('ListingBooking - test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all booking details correctly when both date range and guest count are valid', async () => {
    render(<ListingBooking {...baseProps} />);
    const title = screen.getByTestId('listing-booking-title');
    const subtitle = screen.getByTestId('listing-booking-subtitle');
    const weeklyDiscountAmount = screen.getByTestId(
      'listing-booking-weekly-discount'
    );
    const checkin = screen.getByTestId('listing-booking-checkin');
    const checkout = screen.getByTestId('listing-booking-checkout');
    const total = screen.getByTestId('listing-booking-detail-total');
    const perNight = screen.getByTestId('listing-booking-detail-perNight');
    const buttonBooking = screen.getByTestId('listing-booking-button-booking');
    expect(buttonBooking).toBeEnabled();
    await waitFor(() => {
      expect(checkin).toHaveTextContent(today.toLocaleDateString());
    });
    await waitFor(() => {
      expect(checkout).toHaveTextContent(week.toLocaleDateString());
    });
    await waitFor(() => {
      expect(title).toHaveTextContent('BOB 1138');
    });
    await waitFor(() => {
      expect(subtitle).toHaveTextContent('5 noches');
    });
    await waitFor(() => {
      expect(perNight).toHaveTextContent('BOB 1050.00');
    });
    await waitFor(() => {
      expect(weeklyDiscountAmount).toHaveTextContent('BOB 12.00');
    });
    await waitFor(() => {
      expect(total).toHaveTextContent('BOB 1138.00');
    });
    expect(
      screen.queryByTestId('listing-booking-button-reload')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('listing-booking-validated-date')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('listing-booking-validated-guest')
    ).not.toBeInTheDocument();
  }, 10000);

  it('should display an error message when the date range is invalid', async () => {
    const t = getTranslation('es');
    render(<ListingBooking {...baseProps} isAvailable={false} />);
    const validateDate = screen.getByTestId('listing-booking-validated-date');
    await waitFor(() => {
      expect(validateDate).toHaveTextContent(
        t.listingDetail.booking.inactiveDates
      );
    });
    expect(
      screen.queryByTestId('listing-booking-button-reload')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('listing-booking-button-booking')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('listing-booking-detail')
    ).not.toBeInTheDocument();
  });

  it('should display an error message and hide buttons when guest count is invalid', async () => {
    const t = getTranslation('es');
    render(<ListingBooking {...baseProps} isGuestCountValid={false} />);
    const validateGuest = screen.getByTestId('listing-booking-validated-guest');
    await waitFor(() => {
      expect(validateGuest).toHaveTextContent(
        t.listingDetail.booking.guestLimitExceeded
      );
    });
    expect(
      screen.queryByTestId('listing-booking-button-reload')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('listing-booking-button-booking')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('listing-booking-detail')
    ).not.toBeInTheDocument();
  });

  it('should render placeholders when no pricing, calendar, or date info is available', async () => {
    const t = getTranslation('es');
    render(
      <ListingBooking
        {...baseProps}
        calendarSettings={mockCalendar}
        checkIn={null}
        checkout={null}
      />
    );
    const checkin = screen.getByTestId('listing-booking-checkin');
    const checkout = screen.getByTestId('listing-booking-checkout');
    await waitFor(() => {
      expect(checkin).toHaveTextContent(t.search.addDate);
    });
    await waitFor(() => {
      expect(checkout).toHaveTextContent(t.search.addDate);
    });
    expect(
      screen.queryByTestId('listing-booking-button-reload')
    ).not.toBeInTheDocument();
  });

  it('should display monthly discount when applicable', async () => {
    const PriceWithDiscount = {
      ...mockPricing,
      monthlyDiscountAmount: 200,
    };
    render(
      <ListingBooking
        {...baseProps}
        pricing={PriceWithDiscount}
        checkIn={today}
        checkout={month}
      />
    );
    const MonthlyDiscountAmount = screen.getByTestId(
      'listing-booking-monthly-discount'
    );
    const subtitle = screen.getByTestId('listing-booking-subtitle');
    await waitFor(() => {
      expect(subtitle).toHaveTextContent('mensual');
    });
    await waitFor(() => {
      expect(MonthlyDiscountAmount).toHaveTextContent('200');
    });
    expect(
      screen.queryByTestId('listing-booking-button-reload')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('listing-booking-button-booking')
    ).toBeInTheDocument();
  });

  it('should call onReloadAvailability when reload button is clicked', async () => {
    const mockOnReloadAvailability = jest.fn();
    render(
      <ListingBooking
        {...baseProps}
        pricing={null}
        onReloadAvailability={mockOnReloadAvailability}
      />
    );
    const reloadButton = screen.getByTestId('listing-booking-button-reload');
    expect(reloadButton).toBeInTheDocument();
    fireEvent.click(reloadButton);
    expect(mockOnReloadAvailability).toHaveBeenCalled();
  });
});
