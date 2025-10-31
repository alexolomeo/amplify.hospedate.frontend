import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabFlexible from '@/components/React/Search/Calendar/TabFlexible';
import { Flexible } from '@/types/search';

describe('TabFlexible Component', () => {
  const mockUpdate = jest.fn();

  const defaultProps = {
    flexible: Flexible.Week,
    onUpdate: mockUpdate,
    lang: 'es' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all flexible options as buttons', () => {
    render(<TabFlexible {...defaultProps} />);
    expect(
      screen.getByTestId(`test-tab-flexible-${Flexible.Month}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`test-tab-flexible-${Flexible.Weekend}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`test-tab-flexible-${Flexible.Week}`)
    ).toBeInTheDocument();
  });

  it('should highlight the initially selected flexible option', () => {
    render(<TabFlexible {...defaultProps} />);
    const activeButton = screen.getByTestId(
      `test-tab-flexible-${Flexible.Weekend}`
    );
    expect(activeButton).not.toHaveClass('outline');
  });

  it('should call onUpdate and change selected option when clicking another button', () => {
    render(<TabFlexible {...defaultProps} />);
    const newButton = screen.getByTestId(`test-tab-flexible-${Flexible.Month}`);
    fireEvent.click(newButton);
    expect(mockUpdate).toHaveBeenCalledWith(Flexible.Month);
  });

  it('should apply outline to inactive buttons', () => {
    render(<TabFlexible {...defaultProps} />);
    const inactiveButton = screen.getByTestId(
      `test-tab-flexible-${Flexible.Month}`
    );
    expect(inactiveButton.className).toContain('btn-secondary');
  });
});
