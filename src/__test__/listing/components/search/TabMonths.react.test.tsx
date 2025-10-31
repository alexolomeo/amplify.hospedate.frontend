import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabMonths from '@/components/React/Search/Calendar/TabMonths';
import { addMonths, startOfMonth } from 'date-fns';

describe('TabMonths Component', () => {
  const mockUpdate = jest.fn();
  const startMonth = startOfMonth(new Date(2025, 6, 1));
  const endMonth = startOfMonth(addMonths(startMonth, 3));

  const defaultProps = {
    lang: 'es' as const,
    startMonth,
    endMonth,
    onUpdate: mockUpdate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering and UI', () => {
    it('should render correctly with initial values', () => {
      render(<TabMonths {...defaultProps} />);
      expect(
        screen.getByTestId('test-tab-months-question')
      ).toBeInTheDocument();

      const rangeInput = screen.getByRole('slider') as HTMLInputElement;
      expect(rangeInput).toBeInTheDocument();
      expect(rangeInput.value).toBe('3'); // 3 months default

      const label = screen.getByText('3 meses');
      expect(label).toBeInTheDocument();
    });

    it('should show start and end dates formatted', () => {
      render(<TabMonths {...defaultProps} />);
      const text = screen.getByText(/1 jul 2025 - 1 oct 2025/i);
      expect(text).toBeInTheDocument();
    });
  });

  describe('Interaction and behavior', () => {
    it('should update the months and call onUpdate when slider changes', async () => {
      render(<TabMonths {...defaultProps} />);
      const rangeInput = screen.getByRole('slider');

      fireEvent.change(rangeInput, { target: { value: '5' } });

      await waitFor(() => {
        expect(screen.getByText('5 meses')).toBeInTheDocument();
        expect(mockUpdate).toHaveBeenCalledWith(
          startMonth,
          startOfMonth(addMonths(startMonth, 5))
        );
      });
    });

    it('should not allow values less than 1 or greater than 12', () => {
      render(<TabMonths {...defaultProps} />);
      const rangeInput = screen.getByRole('slider');
      expect(rangeInput).toHaveAttribute('min', '1');
      expect(rangeInput).toHaveAttribute('max', '12');
    });
  });
});
