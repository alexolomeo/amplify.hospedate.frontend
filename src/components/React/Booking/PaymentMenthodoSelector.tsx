import React from 'react';
import Mastercard from '/src/icons/Mastercard.svg?react';
import Visa from '/src/icons/Visa.svg?react';
import Qr from '/src/icons/Qr.svg?react';
import ShieldCheckIcon from '/src/icons/shield-check.svg?react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

export type Method = 'qr' | 'card';

interface Props {
  lang?: SupportedLanguages;
  selected: Method;
  onSelect: (m: Method) => void;
}

export default function PaymentMethodSelector({
  lang = 'es',
  onSelect,
}: Props) {
  const base =
    'cursor-pointer flex items-center justify-between w-full rounded-xl px-6 py-4 transition';

  const buttonStyle =
    'border border-[var(--color-info-bg)] bg-[var(--color-base-150)] text-[var(--color-info-bg)] font-bold';

  const t = getTranslation(lang);
  return (
    <section className="space-y-6">
      <h2 className="font-sans text-3xl font-bold text-[var(--color-base-content)]">
        {t.paymentMethod.pageTitles}
      </h2>

      <button
        type="button"
        onClick={() => onSelect('qr')}
        className={`${base} ${buttonStyle}`}
      >
        <div className="flex items-center gap-3">
          <span className="font-bold">{t.paymentMethod.titleQr}</span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelect('card')}
        className={`${base} ${buttonStyle}`}
      >
        <div className="flex items-center gap-3">
          <span className="font-bold">{t.paymentMethod.titleCard}</span>
        </div>
      </button>

      <div className="mt-4 flex items-center justify-end gap-2 text-sm font-medium text-[var(--color-secondary)]">
        <span>{t.paymentMethod.paymentSecurity}</span>

        <Mastercard className="h-8 w-auto" />
        <Visa className="h-8 w-auto" />
        <Qr className="h-8 w-auto" />
        <ShieldCheckIcon className="h-8 w-auto" />
      </div>
    </section>
  );
}
