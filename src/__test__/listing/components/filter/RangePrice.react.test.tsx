import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RangePrice from '@/components/React/Search/Filters/RangePrice';

describe('RangePrice Component', () => {
  const mockOnUpdatePrices = jest.fn();
  const defaultProps = {
    minAllowedPrice: 100,
    maxAllowedPrice: 1000,
    currentMinPrice: 200,
    currentMaxPrice: 800,
    lang: 'es' as const,
    currency: 'USD',
    onUpdatePrices: mockOnUpdatePrices,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering and Initial State', () => {
    it('should render the component with correct price range title', () => {
      render(<RangePrice {...defaultProps} />);
      expect(screen.getByTestId('test-range-title')).toBeInTheDocument();
      expect(
        screen.getByTestId('test-range-title-price-min')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('test-range-title-price-max')
      ).toBeInTheDocument();
    });

    it('should display the initial clamped current range values', () => {
      render(<RangePrice {...defaultProps} />);
      expect(screen.getByText('USD 200.00')).toBeInTheDocument();
      expect(screen.getByText('USD 800.00')).toBeInTheDocument();
    });

    it('should clamp initial currentMinPrice below minAllowedPrice', () => {
      render(<RangePrice {...defaultProps} currentMinPrice={50} />);
      expect(screen.getByText('USD 100.00')).toBeInTheDocument();
    });

    it('should clamp initial currentMaxPrice above maxAllowedPrice', () => {
      render(<RangePrice {...defaultProps} currentMaxPrice={1200} />);
      expect(screen.getByText('USD 1000.00')).toBeInTheDocument();
    });

    it('should handle inverted initial current range by clamping to allowed bounds', () => {
      render(
        <RangePrice
          {...defaultProps}
          currentMinPrice={900}
          currentMaxPrice={300}
        />
      );
      // Initial currentRange should be [300, 900] after clamping and reordering by lazy initializer
      // Math.max(900, 100) = 900
      // Math.min(300, 1000) = 300
      // Since 900 > 300, it falls back to [minAllowedPrice, maxAllowedPrice]
      expect(screen.getByText('USD 100.00')).toBeInTheDocument();
      expect(screen.getByText('USD 1000.00')).toBeInTheDocument();
    });
  });

  describe('Prop Updates', () => {
    it('should update internal range when currentMinPrice prop changes', () => {
      const { rerender } = render(<RangePrice {...defaultProps} />);
      // Change only currentMinPrice prop, should re-clamp and update internal state
      rerender(<RangePrice {...defaultProps} currentMinPrice={150} />);
      expect(screen.getByText('USD 150.00')).toBeInTheDocument();
      expect(screen.getByText('USD 800.00')).toBeInTheDocument();
    });

    it('should update internal range when currentMaxPrice prop changes', () => {
      const { rerender } = render(<RangePrice {...defaultProps} />);
      // Change only currentMaxPrice prop, should re-clamp and update internal state
      rerender(<RangePrice {...defaultProps} currentMaxPrice={950} />);
      expect(screen.getByText('USD 200.00')).toBeInTheDocument();
      expect(screen.getByText('USD 950.00')).toBeInTheDocument();
    });

    it('should clamp updated props if they are out of allowed bounds', () => {
      const { rerender } = render(<RangePrice {...defaultProps} />);
      rerender(
        <RangePrice
          {...defaultProps}
          currentMinPrice={50}
          currentMaxPrice={1200}
        />
      );
      expect(screen.getByText('USD 100.00')).toBeInTheDocument();
      expect(screen.getByText('USD 1000.00')).toBeInTheDocument();
    });

    it('should re-clamp to allowed bounds if updated props are inverted', () => {
      const { rerender } = render(<RangePrice {...defaultProps} />);
      rerender(
        <RangePrice
          {...defaultProps}
          currentMinPrice={900}
          currentMaxPrice={300}
        />
      );
      expect(screen.getByText('USD 100.00')).toBeInTheDocument();
      expect(screen.getByText('USD 1000.00')).toBeInTheDocument();
    });
  });
});
