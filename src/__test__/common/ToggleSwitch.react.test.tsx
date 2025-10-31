import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToggleSwitch from '@/components/React/Common/ToggleSwitch';

describe('ToggleSwitch', () => {
  const defaultProps = {
    title: 'Permitir Mascotas',
    checked: false,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with the correct title', () => {
    render(<ToggleSwitch {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByTestId('test-toggle-input')).toBeInTheDocument();
  });

  test('renders the toggle as unchecked when checked prop is false', () => {
    render(<ToggleSwitch {...defaultProps} checked={false} />);
    const toggleInput = screen.getByTestId('test-toggle-input');
    expect(toggleInput).not.toBeChecked();
  });

  test('renders the toggle as checked when checked prop is true', () => {
    render(<ToggleSwitch {...defaultProps} checked={true} />);
    const toggleInput = screen.getByTestId('test-toggle-input');
    expect(toggleInput).toBeChecked();
  });

  test('calls onChange with the new checked state when the toggle is clicked', () => {
    render(<ToggleSwitch {...defaultProps} checked={false} />);
    const toggleInput = screen.getByTestId('test-toggle-input');

    fireEvent.click(toggleInput);

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onChange).toHaveBeenCalledWith(true);
  });

  test('renders the description when provided', () => {
    const propsWithDescription = {
      ...defaultProps,
      description: 'Esta es una descripción detallada.',
    };
    render(<ToggleSwitch {...propsWithDescription} />);

    expect(
      screen.getByText(propsWithDescription.description)
    ).toBeInTheDocument();
  });

  test('does not render the description when not provided', () => {
    render(<ToggleSwitch {...defaultProps} />);

    expect(
      screen.queryByText('Esta es una descripción detallada.')
    ).not.toBeInTheDocument();
  });

  test('renders the action button when buttonLabel and buttonAction are provided', () => {
    const propsWithButton = {
      ...defaultProps,
      buttonLabel: 'Ver más',
      buttonAction: jest.fn(),
    };
    render(<ToggleSwitch {...propsWithButton} />);

    const actionButton = screen.getByTestId('test-toggle-button-action');
    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toHaveTextContent(propsWithButton.buttonLabel);
  });

  test('does not render the action button if buttonLabel or buttonAction is missing', () => {
    // not buttonLabel
    const propsWithoutLabel = { ...defaultProps, buttonAction: jest.fn() };
    const { rerender } = render(<ToggleSwitch {...propsWithoutLabel} />);
    expect(
      screen.queryByTestId('test-toggle-button-action')
    ).not.toBeInTheDocument();

    // not buttonAction
    const propsWithoutAction = { ...defaultProps, buttonLabel: 'Ver más' };
    rerender(<ToggleSwitch {...propsWithoutAction} />);
    expect(
      screen.queryByTestId('test-toggle-button-action')
    ).not.toBeInTheDocument();
  });

  test('calls buttonAction when the action button is clicked', () => {
    const propsWithButton = {
      ...defaultProps,
      buttonLabel: 'Ver detalles',
      buttonAction: jest.fn(),
    };
    render(<ToggleSwitch {...propsWithButton} />);

    const actionButton = screen.getByTestId('test-toggle-button-action');
    fireEvent.click(actionButton);

    expect(propsWithButton.buttonAction).toHaveBeenCalledTimes(1);
  });
});
