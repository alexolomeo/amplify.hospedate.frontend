import React, { forwardRef, useId, useState } from 'react';
// Note: Icon names are swapped to match action-based UX pattern
// (icon shows what WILL happen when clicked, not current state)
import EyeIcon from '/src/icons/eye-slash.svg?react'; // Actually shows slashed eye (for hiding)
import EyeOffIcon from '/src/icons/eye.svg?react'; // Actually shows open eye (for showing)
export interface AppPasswordRevealInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'onChange'
  > {
  /** Controlled input value. */
  value: string;
  /** Controlled setter for the input value. */
  onChange: (value: string) => void;

  /** Accessible label for “show password” */
  ariaLabelShow: string;
  /** Accessible label for “hide password” */
  ariaLabelHide: string;

  /** Optional visible label shown above the field. */
  label?: string;
  /** Optional error message shown below the field (also sets aria-invalid). */
  error?: string | null;

  /** Optional container CSS classes. */
  containerClassName?: string;
  /** Optional input CSS classes. */
  inputClassName?: string;
  /** Optional toggle button CSS classes. */
  buttonClassName?: string;

  /** Optional testing IDs. */
  inputTestId?: string;
  buttonTestId?: string;
}

const AppPasswordRevealInput = forwardRef<
  HTMLInputElement,
  AppPasswordRevealInputProps
>(
  (
    {
      value,
      onChange,
      ariaLabelShow,
      ariaLabelHide,
      label,
      error,
      id,
      placeholder,
      autoComplete = 'new-password',
      disabled,
      containerClassName,
      inputClassName,
      buttonClassName,
      inputTestId,
      buttonTestId,
      ...rest
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? `pw-input-${reactId}`;
    const [shown, setShown] = useState(false);

    const ariaLabel = shown ? ariaLabelHide : ariaLabelShow;
    const type = shown ? 'text' : 'password';

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-base-content mb-2 block text-xs leading-4"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            data-testid={inputTestId}
            aria-invalid={!!error}
            className={[
              'register-input h-[48px] w-full pr-12',
              inputClassName ?? '',
            ].join(' ')}
            {...rest}
          />

          <button
            type="button"
            onClick={() => setShown((v) => !v)}
            aria-label={ariaLabel}
            title={ariaLabel}
            aria-pressed={shown}
            disabled={disabled}
            data-testid={buttonTestId}
            className={[
              'focus-visible:ring-primary/40 absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-2',
              'focus:outline-none focus-visible:ring',
              buttonClassName ?? '',
            ].join(' ')}
          >
            {shown ? (
              <EyeOffIcon className="text-base-content/80 h-4 w-4" />
            ) : (
              <EyeIcon className="text-base-content/80 h-4 w-4" />
            )}
          </button>
        </div>

        {error && (
          <p className="text-error mt-1 px-1 text-xs" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AppPasswordRevealInput.displayName = 'AppPasswordRevealInput';
export default AppPasswordRevealInput;
