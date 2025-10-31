import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuantitySelector from '@/components/React/Common/QuantitySelector';

describe('QuantitySelector', () => {
  const defaultProps = {
    title: 'Número de Personas',
    value: 1,
    onIncrement: jest.fn(),
    onDecrement: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with the correct title and initial value', () => {
    render(<QuantitySelector {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.value.toString())).toBeInTheDocument();

    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
  });

  test('calls onIncrement when the "+" button is clicked', () => {
    render(<QuantitySelector {...defaultProps} />);
    const incrementButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(incrementButton);

    expect(defaultProps.onIncrement).toHaveBeenCalledTimes(1);
    expect(defaultProps.onDecrement).not.toHaveBeenCalled();
  });

  test('calls onDecrement when the "-" button is clicked', () => {
    const props = { ...defaultProps, value: 5 };
    render(<QuantitySelector {...props} />);
    const decrementButton = screen.getByRole('button', { name: '-' });
    fireEvent.click(decrementButton);

    expect(props.onDecrement).toHaveBeenCalledTimes(1);
    expect(props.onIncrement).not.toHaveBeenCalled();
  });

  test('disables the "-" button when value is at min', () => {
    const props = { ...defaultProps, value: 0, min: 0 };
    render(<QuantitySelector {...props} />);
    const decrementButton = screen.getByRole('button', { name: '-' });

    expect(decrementButton).toBeDisabled();
    // Make sure the increment button is NOT disabled (unless it is also max)
    expect(screen.getByRole('button', { name: '+' })).not.toBeDisabled();
  });

  test('disables the "+" button when value is at max', () => {
    const props = { ...defaultProps, value: 10, max: 10 };
    render(<QuantitySelector {...props} />);
    const incrementButton = screen.getByRole('button', { name: '+' });

    expect(incrementButton).toBeDisabled();
    // Make sure the decrement button is NOT disabled (unless it is also min)
    expect(screen.getByRole('button', { name: '-' })).not.toBeDisabled();
  });

  test('disables both buttons when value equals min and max', () => {
    const props = { ...defaultProps, value: 1, min: 1, max: 1 };
    render(<QuantitySelector {...props} />);
    const incrementButton = screen.getByRole('button', { name: '+' });
    const decrementButton = screen.getByRole('button', { name: '-' });

    expect(incrementButton).toBeDisabled();
    expect(decrementButton).toBeDisabled();
  });

  test('buttons are not disabled prematurely', () => {
    const props = { ...defaultProps, value: 5, min: 0, max: 10 };
    render(<QuantitySelector {...props} />);
    const incrementButton = screen.getByRole('button', { name: '+' });
    const decrementButton = screen.getByRole('button', { name: '-' });

    expect(incrementButton).not.toBeDisabled();
    expect(decrementButton).not.toBeDisabled();
  });
});
