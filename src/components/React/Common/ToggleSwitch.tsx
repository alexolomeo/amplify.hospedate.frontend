import React from 'react';
import clsx from 'clsx';

interface ToggleSwitchProps {
  title?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  buttonLabel?: string;
  buttonAction?: () => void;
  titleClassName?: string;
  descriptionClassName?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  title,
  checked,
  onChange,
  description,
  buttonLabel,
  buttonAction,
  titleClassName = 'text-xs leading-3 font-normal',
  descriptionClassName = 'edit-listing-description',
  disabled = false,
}) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (disabled) return;
    onChange(e.target.checked);
  };

  return (
    <div className="flex items-center justify-between gap-x-2">
      <div className="space-y-1">
        {title && <p className={clsx(titleClassName)}>{title}</p>}
        {description && (
          <p className={clsx(descriptionClassName)}>{description}</p>
        )}
        {buttonLabel && buttonAction && (
          <button
            className="text-base-content cursor-pointer px-2 text-xs font-normal underline"
            onClick={buttonAction}
            data-testid="test-toggle-button-action"
            type="button"
          >
            {buttonLabel}
          </button>
        )}
      </div>
      <div>
        <input
          type="checkbox"
          className="toggle toggle-md toggle-primary"
          data-testid="test-toggle-input"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          aria-disabled={disabled}
        />
      </div>
    </div>
  );
};

export default ToggleSwitch;
