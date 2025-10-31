import React from 'react';
import { useId } from 'react';
import type { SupportedLanguages } from '@/utils/i18n';
import Point from '/src/icons/point.svg?react';
import PointBlue from '/src/icons/point-blue.svg?react';
import PointGreen from '/src/icons/point-green.svg?react';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'info' | 'brand';

type MessageParts = {
  prefix?: string;
  highlight?: string;
  suffix?: string;
  highlightClassName?: string;
};
type BadgeIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type OptionItem = {
  value: 'published' | 'unpublished';
  title: string;
  description: string;
};
type OptionsBlock = {
  selectedValue: OptionItem['value'];
  onChange: (next: OptionItem['value']) => void;
  items: OptionItem[];
};

type BadgeProp = {
  label: string;
  variant?: BadgeVariant;
};

type CTAProp = { label: string; onClick: () => void };

interface Props {
  lang?: SupportedLanguages;
  title?: string;
  badge?: BadgeProp;
  message?: string;
  messageParts?: MessageParts;
  cta?: CTAProp;
  options?: OptionsBlock;
  badgeIcon?: BadgeIcon;
  badgeIconsByVariant?: Partial<Record<BadgeVariant, BadgeIcon>>;
}

function badgeBaseClasses() {
  return 'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium';
}

function variantClasses(variant: BadgeVariant, active: boolean) {
  const warningInactive =
    'text-[var(--color-warning)] bg-transparent ring-1 ring-[var(--color-warning)]/30';
  const warningActive = 'text-white bg-[var(--color-warning)] ring-0';
  const brandInactive =
    'text-[var(--color-primary)] bg-transparent ring-1 ring-[var(--color-primary)]/30';
  const brandActive = 'text-white bg-[var(--color-primary)] ring-0';
  const successInactive =
    'text-[var(--color-success)] bg-transparent ring-1 ring-[var(--color-success)]/30';
  const successActive = 'text-white bg-[var(--color-success)] ring-0';

  switch (variant) {
    case 'brand':
      return active ? brandActive : brandInactive;
    case 'warning':
      return active ? warningActive : warningInactive;
    case 'neutral':
      return 'bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200';
    case 'success':
      return active ? successActive : successInactive;
    case 'info':
      return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200';
    default:
      return '';
  }
}

export default function ListingStatusCard({
  title,
  badge,
  message,
  messageParts,
  cta,
  options,
  badgeIcon,
  badgeIconsByVariant,
}: Props) {
  const { prefix, highlight, suffix, highlightClassName } = messageParts ?? {};

  const inferredVariant: BadgeVariant | undefined =
    !badge?.variant && options
      ? options.selectedValue === 'published'
        ? 'success'
        : 'warning'
      : undefined;

  const visualVariant: BadgeVariant =
    badge?.variant ?? inferredVariant ?? 'success';

  const classes = `${badgeBaseClasses()} ${variantClasses(visualVariant, false)}`;

  const Icon =
    badgeIconsByVariant?.[visualVariant] ??
    badgeIcon ??
    (visualVariant === 'brand'
      ? PointBlue
      : visualVariant === 'success'
        ? PointGreen
        : Point);

  const handleChoose = (
    value: OptionItem['value'],
    e?: React.SyntheticEvent
  ) => {
    e?.preventDefault();
    e?.stopPropagation();
    options?.onChange(value);
  };

  const groupId = useId();

  return (
    <div className="flex w-full flex-col items-center">
      {title && (
        <h2 className="text-xl font-semibold text-[var(--color-base-content)] md:text-2xl">
          {title}
        </h2>
      )}

      <img
        src="/images/house.webp"
        alt="listing-status"
        className="mt-6 h-[244px] w-auto object-contain"
      />

      {badge?.label && (
        <div className="mt-6">
          <span className={classes}>
            <Icon className="h-4 w-4 fill-current" />
            {badge.label}
          </span>
        </div>
      )}

      {(message || prefix || highlight || suffix) && (
        <div className="mt-4 max-w-[680px] px-4">
          {message ? (
            <p className="text-sm leading-6 text-[var(--color-base-content)] md:text-base">
              {message}
            </p>
          ) : (
            <p className="text-sm leading-6 text-[var(--color-base-content)] md:text-base">
              {prefix ? `${prefix} ` : null}
              {highlight ? (
                <span
                  className={
                    highlightClassName ??
                    'font-semibold text-[var(--color-base-content)]'
                  }
                >
                  {highlight}
                </span>
              ) : null}
              {suffix ? ` ${suffix}` : null}
            </p>
          )}
        </div>
      )}

      {cta && (
        <button
          type="button"
          onClick={cta.onClick}
          className="mt-5 rounded-3xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:rounded-2xl"
        >
          {cta.label}
        </button>
      )}

      {options && options.items?.length > 0 && (
        <div className="mt-8 grid w-full max-w-[820px] grid-cols-1 gap-4 px-4 md:grid-cols-2">
          {options.items.map((opt) => {
            const selected = options.selectedValue === opt.value;
            const radioId = `${groupId}-${opt.value}`;
            return (
              <div
                key={opt.value}
                role="button"
                tabIndex={0}
                onClick={(e) => handleChoose(opt.value, e)}
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') &&
                  handleChoose(opt.value, e)
                }
                className={`cursor-pointer rounded-2xl border p-4 text-left transition-all ${
                  selected
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    id={radioId}
                    type="radio"
                    name={`listing-status-option-${groupId}`}
                    className="mt-1"
                    checked={selected}
                    readOnly
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoose(opt.value, e);
                    }}
                  />
                  <label htmlFor={radioId} className="cursor-pointer">
                    <div className="text-base text-[var(--color-base-content)]">
                      {opt.title}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-neutral-600">
                      {opt.description}
                    </div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
