import React, { type ChangeEvent } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface QrPaymentFormProps {
  lang?: SupportedLanguages;
  nit: string;
  setNit: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  touched: { nit: boolean; name: boolean };
  setTouched: (
    value: (s: { nit: boolean; name: boolean }) => {
      nit: boolean;
      name: boolean;
    }
  ) => void;
  nitError: string | null;
  nameError: string | null;
}

export default function QrPaymentForm({
  lang = 'es',
  nit,
  setNit,
  name,
  setName,
  touched,
  setTouched,
  nitError,
  nameError,
}: QrPaymentFormProps) {
  const t = getTranslation(lang);
  const onNitChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filteredValue = e.target.value.replace(/\D/g, '');
    setNit(filteredValue);
  };

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const inputBase =
    'w-full rounded-full border px-4 py-2 text-sm placeholder-neutral ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-200 ' +
    'border-base-300';

  const invalidClasses = 'border-red-500 focus:ring-red-200';

  return (
    <form noValidate>
      <section className="space-y-4">
        <h2 className="text-2xl font-normal">{t.paymentMethod.billingInfo}</h2>
        <div>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            placeholder={t.paymentMethod.nit}
            value={nit}
            onChange={onNitChange}
            onBlur={() => setTouched((s) => ({ ...s, nit: true }))}
            aria-invalid={touched.nit && !!nitError}
            aria-describedby="nit-error"
            className={`${inputBase} ${touched.nit && nitError ? invalidClasses : ''}`}
          />
          {touched.nit && nitError && (
            <p id="nit-error" className="text-error mx-2 mt-1 text-xs">
              {nitError}
            </p>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder={t.paymentMethod.business}
            value={name}
            onChange={onNameChange}
            onBlur={() => setTouched((s) => ({ ...s, name: true }))}
            aria-invalid={touched.name && !!nameError}
            aria-describedby="name-error"
            className={`${inputBase} ${touched.name && nameError ? invalidClasses : ''}`}
          />
          {touched.name && nameError && (
            <p id="name-error" className="text-error mx-2 mt-1 text-xs">
              {nameError}
            </p>
          )}
        </div>
      </section>
    </form>
  );
}
