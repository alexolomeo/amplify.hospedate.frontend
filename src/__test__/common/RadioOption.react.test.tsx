import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RadioOption } from '@/components/React/Common/RadioOption';

describe('RadioOption', () => {
  const defaultProps = {
    id: 'test-id-1',
    name: 'test-radio-group',
    label: 'Opción de Prueba',
    description: 'Esta es una descripción de prueba para la opción.',
    checked: false,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const partialLabelMatcher = (text: string) =>
    new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  test('renders with the correct label and description', () => {
    render(<RadioOption {...defaultProps} />);
    expect(screen.getByText(defaultProps.label)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });

  test('renders the radio input with correct attributes', () => {
    render(<RadioOption {...defaultProps} />);

    const radioInput = screen.getByRole('radio', {
      name: partialLabelMatcher(defaultProps.label),
    });
    expect(radioInput).toBeInTheDocument();
    expect(radioInput).toHaveAttribute('id', defaultProps.id);
    expect(radioInput).toHaveAttribute('name', defaultProps.name);
    expect(radioInput).toHaveAttribute('value', defaultProps.id);
    expect(radioInput).not.toBeChecked();
  });

  test('renders the radio input as checked when prop is true', () => {
    render(<RadioOption {...defaultProps} checked />);

    const radioInput = screen.getByRole('radio', {
      name: partialLabelMatcher(defaultProps.label),
    });
    expect(radioInput).toBeChecked();
  });

  test('calls onChange with correct id when radio is clicked', () => {
    render(<RadioOption {...defaultProps} />);

    const radioInput = screen.getByRole('radio', {
      name: partialLabelMatcher(defaultProps.label),
    });
    fireEvent.click(radioInput);

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onChange).toHaveBeenCalledWith(defaultProps.id);
  });

  test('calls onChange with correct id when label is clicked', () => {
    render(<RadioOption {...defaultProps} />);

    const radioByLabel = screen.getByLabelText(
      partialLabelMatcher(defaultProps.label)
    );
    fireEvent.click(radioByLabel);

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onChange).toHaveBeenCalledWith(defaultProps.id);
  });

  test('renders the action button when buttonLabel and buttonAction are provided', () => {
    const propsWithButton = {
      ...defaultProps,
      buttonLabel: 'Más información',
      buttonAction: jest.fn(),
    };
    render(<RadioOption {...propsWithButton} />);

    const actionButton = screen.getByRole('button', {
      name: propsWithButton.buttonLabel,
    });
    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toBeEnabled();
  });

  test('does not render the action button if buttonLabel or buttonAction is missing', () => {
    const { rerender } = render(
      <RadioOption {...defaultProps} buttonAction={jest.fn()} />
    );
    expect(
      screen.queryByRole('button', { name: /más información/i })
    ).not.toBeInTheDocument();

    rerender(<RadioOption {...defaultProps} buttonLabel="Más información" />);
    expect(
      screen.queryByRole('button', { name: /más información/i })
    ).not.toBeInTheDocument();
  });

  test('calls buttonAction when the action button is clicked', () => {
    const propsWithButton = {
      ...defaultProps,
      buttonLabel: 'Más información',
      buttonAction: jest.fn(),
    };
    render(<RadioOption {...propsWithButton} />);

    const actionButton = screen.getByRole('button', {
      name: propsWithButton.buttonLabel,
    });
    fireEvent.click(actionButton);

    expect(propsWithButton.buttonAction).toHaveBeenCalledTimes(1);
  });

  test('clicking the action button does NOT toggle the radio nor call onChange', () => {
    const propsWithButton = {
      ...defaultProps,
      buttonLabel: 'Más información',
      buttonAction: jest.fn(),
    };
    render(<RadioOption {...propsWithButton} />);

    const radio = screen.getByRole('radio', {
      name: partialLabelMatcher(defaultProps.label),
    });
    const actionButton = screen.getByRole('button', {
      name: propsWithButton.buttonLabel,
    });

    expect(radio).not.toBeChecked();

    fireEvent.click(actionButton);

    expect(radio).not.toBeChecked();
    expect(defaultProps.onChange).not.toHaveBeenCalled();
    expect(propsWithButton.buttonAction).toHaveBeenCalledTimes(1);
  });

  describe('disabled behavior', () => {
    test('disables radio and prevents onChange when disabled', () => {
      render(<RadioOption {...defaultProps} disabled />);

      const radioInput = screen.getByRole('radio', {
        name: partialLabelMatcher(defaultProps.label),
      });
      expect(radioInput).toBeDisabled();

      fireEvent.click(radioInput);
      expect(defaultProps.onChange).not.toHaveBeenCalled();

      const radioByLabel = screen.getByLabelText(
        partialLabelMatcher(defaultProps.label)
      );
      fireEvent.click(radioByLabel);
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });

    test('disables action button and prevents buttonAction when disabled', () => {
      const propsWithButton = {
        ...defaultProps,
        buttonLabel: 'Más información',
        buttonAction: jest.fn(),
        disabled: true,
      };
      render(<RadioOption {...propsWithButton} />);

      const actionButton = screen.getByRole('button', {
        name: propsWithButton.buttonLabel!,
      });
      expect(actionButton).toBeDisabled();

      fireEvent.click(actionButton);
      expect(propsWithButton.buttonAction).not.toHaveBeenCalled();
    });
  });
});
