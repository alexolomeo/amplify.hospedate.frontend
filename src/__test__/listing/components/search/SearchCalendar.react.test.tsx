import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchCalendarTab, Flexible } from '@/types/search';
import SearchCalendar from '@/components/React/Search/SearchCalendar';
const calendarState = {
  checkIn: new Date('2025-01-01'),
  checkOut: new Date('2025-01-10'),
  monthlyStart: new Date('2025-02-01'),
  monthlyEnd: new Date('2025-04-01'),
  flexible: Flexible.Week,
  activeTab: SearchCalendarTab.Calendar,
};

describe('SearchCalendar Component', () => {
  const defaultProps = {
    calendarState: calendarState,
    monthStyle: '',
    lang: 'es' as const,
    onUpdateCalendar: jest.fn(),
    onUpdateMonths: jest.fn(),
    onUpdateFlexible: jest.fn(),
    onUpdateActiveTab: jest.fn(),
    compactMode: false,
    dividerCondition: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all three tabs', () => {
    render(<SearchCalendar {...defaultProps} />);

    expect(screen.getByTestId('test-search-calendar-date')).toBeInTheDocument();
    expect(
      screen.getByTestId('test-search-calendar-month')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('test-search-calendar-flexible')
    ).toBeInTheDocument();
  });

  it('should apply active class to the initial tab (Calendar)', () => {
    render(<SearchCalendar {...defaultProps} />);
    const calendarTab = screen.getByTestId('test-search-calendar-date');
    expect(calendarTab).toHaveClass('tab-active');
  });

  it('should change active tab and call onUpdateActiveTab when clicking "Meses"', () => {
    render(<SearchCalendar {...defaultProps} />);
    const monthsTab = screen.getByTestId('test-search-calendar-month');

    fireEvent.click(monthsTab);
    expect(defaultProps.onUpdateActiveTab).toHaveBeenCalledWith(
      SearchCalendarTab.Months
    );
  });

  it('should change active tab and call onUpdateActiveTab when clicking "Flexible"', () => {
    render(<SearchCalendar {...defaultProps} />);
    const flexibleTab = screen.getByTestId('test-search-calendar-flexible');

    fireEvent.click(flexibleTab);
    expect(defaultProps.onUpdateActiveTab).toHaveBeenCalledWith(
      SearchCalendarTab.Flexible
    );
  });
});
