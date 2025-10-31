import React from 'react';

interface RadioOptionProps {
  id: string;
  name: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (id: string) => void;
  buttonLabel?: string;
  buttonAction?: () => void;
  disabled?: boolean;
}

export const RadioOption: React.FC<RadioOptionProps> = ({
  id,
  name,
  label,
  description,
  checked,
  onChange,
  buttonLabel,
  buttonAction,
  disabled = false,
}) => {
  return (
    <div className="flex items-start gap-x-4">
      <input
        type="radio"
        id={id}
        name={name}
        value={id}
        className="radio radio-primary radio-sm"
        checked={checked}
        onChange={() => {
          if (!disabled) onChange(id);
        }}
        disabled={disabled}
      />

      <div className="space-y-[5px]">
        <label
          htmlFor={id}
          className="cursor-pointer space-y-[5px] select-none"
        >
          <p className="text-sm font-normal">{label}</p>
          <p className="text-neutral text-xs font-normal">{description}</p>
        </label>

        {buttonLabel && buttonAction && (
          <button
            type="button"
            className="text-base-content cursor-pointer px-2 text-xs font-normal underline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!disabled) buttonAction();
            }}
            disabled={disabled}
            aria-disabled={disabled}
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};
