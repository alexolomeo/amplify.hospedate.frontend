import * as Select from '@radix-ui/react-select';
import { forwardRef, useMemo } from 'react';
import clsx from 'clsx';
import ChevronDownIcon from '/src/icons/chevron-down.svg?react';

/**
 * A primitive option for the select field.
 * Use a string when the value and label are identical and the option is always enabled.
 * Example: "Option 1"
 */
type PrimitiveOption = string;
/**
 * An object option for the select field.
 * Use this when you need a custom label, a value different from the label, or to disable the option.
 * Example: { value: "opt2", label: "Option 2", disabled: true }
 */
type ObjectOption = { value: string; label: string; disabled?: boolean };
/**
 * Union type for select options.
 * Use a primitive string for simple options, or an object for custom label/value/disabled.
 */
type AnyOption = PrimitiveOption | ObjectOption;

function isObjectOption(o: AnyOption): o is ObjectOption {
  return typeof o !== 'string';
}

type SelectFieldProps = {
  options: ReadonlyArray<AnyOption>;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  buttonHeight?: string;
  labelFontSize?: string;
  disabled?: boolean;
  side?: 'bottom' | 'top';
  maxPanelPx?: number;
};

const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  function SelectField(
    {
      options,
      value,
      onChange,
      placeholder = 'Selecciona…',
      className,
      buttonClassName,
      dropdownClassName,
      buttonHeight = 'h-8',
      labelFontSize = 'text-base',
      disabled = false,
      side = 'bottom',
      maxPanelPx = 240,
    },
    _ref
  ) {
    const currentLabel = useMemo(() => {
      if (!value) return '';
      const found = options.find((o) =>
        isObjectOption(o) ? o.value === value : o === value
      );
      if (!found) return '';
      return isObjectOption(found) ? found.label : found;
    }, [options, value]);

    return (
      <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
        <div className={clsx('relative', className)}>
          <Select.Trigger
            ref={_ref}
            aria-label="selector"
            className={clsx(
              'flex w-full items-center justify-between rounded-full border px-4 text-lg font-semibold transition-colors',
              buttonHeight,
              disabled
                ? 'bg-base-100 border-base-200 text-base-content/50 cursor-not-allowed'
                : value
                  ? 'border-base-200 text-base-content cursor-pointer'
                  : 'border-base-200 text-base-content cursor-pointer',
              buttonClassName
            )}
          >
            <Select.Value
              placeholder={
                <span className={clsx('truncate', labelFontSize)}>
                  {placeholder}
                </span>
              }
            >
              <span className={clsx('truncate', labelFontSize)}>
                {currentLabel}
              </span>
            </Select.Value>
            <Select.Icon>
              <ChevronDownIcon className="h-4 w-4 text-[var(--color-base-content)]" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              side={side}
              sideOffset={8}
              position="popper"
              className={clsx(
                'text-base-content z-[1000] w-[var(--radix-select-trigger-width)] rounded-2xl bg-[var(--color-primary-content)] shadow-xl',
                dropdownClassName
              )}
            >
              <Select.Viewport
                className="w-full"
                style={{ maxHeight: maxPanelPx, overflow: 'auto' }}
              >
                {options.map((opt) => {
                  const key = isObjectOption(opt) ? opt.value : opt;
                  const val = isObjectOption(opt) ? opt.value : opt;
                  const label = isObjectOption(opt) ? opt.label : opt;
                  const itemDisabled = isObjectOption(opt)
                    ? !!opt.disabled
                    : false;
                  const effectiveDisabled = disabled || itemDisabled;

                  return (
                    <Select.Item
                      key={key}
                      value={val}
                      disabled={effectiveDisabled}
                      className={clsx(
                        'flex items-center justify-center px-4 py-2 text-center text-sm transition-colors',
                        effectiveDisabled
                          ? 'cursor-not-allowed opacity-50'
                          : 'cursor-pointer',
                        value === val ? 'bg-base-200' : 'hover:bg-base-200',
                        'hover:rounded-full focus:outline-none'
                      )}
                    >
                      <Select.ItemText>{label}</Select.ItemText>
                    </Select.Item>
                  );
                })}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </div>
      </Select.Root>
    );
  }
);

export default SelectField;
