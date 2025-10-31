import * as React from 'react';

type Props = {
  id: string;
  value: string;
  onValueChange?: (val: string) => void;
  placeholder?: string;
  autoComplete?: string;
  type?: React.HTMLInputTypeAttribute;
  readOnly?: boolean;
  disabled?: boolean;
  label?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | 'id'
  | 'value'
  | 'onChange'
  | 'type'
  | 'placeholder'
  | 'autoComplete'
  | 'readOnly'
  | 'disabled'
>;

const baseContainer =
  'flex h-12 w-full items-center gap-2 rounded-[16px] border border-[var(--color-neutral-content)] bg-[var(--color-base-100)] px-4';

const baseInput =
  'w-full bg-transparent text-[var(--color-base-content)] placeholder:text-[var(--color-placeholder)] focus:outline-none';

const TextField = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      value,
      onValueChange,
      placeholder,
      autoComplete,
      type = 'text',
      readOnly,
      disabled,
      label,
      icon,
      containerClassName,
      inputClassName,
      ...rest
    },
    ref
  ) => {
    return (
      <label htmlFor={id} className="block">
        {label ? <span className="sr-only">{label}</span> : null}
        <div className={containerClassName ?? baseContainer}>
          {icon}
          <input
            ref={ref}
            id={id}
            name={id}
            type={type}
            autoComplete={autoComplete}
            placeholder={placeholder}
            value={value ?? ''}
            onChange={(e) => onValueChange?.(e.target.value)}
            readOnly={readOnly}
            disabled={disabled}
            className={inputClassName ?? baseInput}
            {...rest}
          />
        </div>
      </label>
    );
  }
);

TextField.displayName = 'TextField';
export default TextField;
