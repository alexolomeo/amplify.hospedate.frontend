import React from 'react';
import clsx from 'clsx';

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string; // Optional ID for the input, useful for accessibility and if the checkbox is part of a group
  name?: string; // Optional name for the input, to group in forms
  className?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  disabled?: boolean;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({
  label,
  checked,
  onChange,
  id,
  name,
  className,
  labelClassName,
  checkboxClassName,
  disabled = false,
}) => {
  const uniqueId = id;

  return (
    <label
      htmlFor={uniqueId}
      className={clsx(
        'flex h-9 flex-row items-center justify-between gap-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className
      )}
    >
      <p className={clsx('text-xs font-normal', labelClassName)}>{label}</p>

      <input
        type="checkbox"
        id={uniqueId}
        name={name}
        className={clsx(
          'checkbox checkbox-primary checkbox-sm',
          checkboxClassName
        )}
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
      />
    </label>
  );
};

export default CheckboxItem;
