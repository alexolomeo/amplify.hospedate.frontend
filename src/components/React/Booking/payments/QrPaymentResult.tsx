import React from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface Props {
  lang?: SupportedLanguages;
  onDownload?: () => void;
}

export default function QrPaymentResult({ lang = 'es', onDownload }: Props) {
  const t = getTranslation(lang);

  return (
    <section className="space-y-8 rounded-xl border border-[var(--color-base-300)] bg-white bg-[repeating-linear-gradient(90deg,transparent,transparent_24px,rgba(0,0,0,0.02)_24px,rgba(0,0,0,0.02)_48px)] p-6 md:p-10">
      {/* title */}
      <h2 className="text-2xl font-semibold text-[var(--color-base-content)]">
        {t.paymentMethod.qrResult}
      </h2>

      {/* Two columns */}
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[min-content_1fr]">
        <div className="flex min-h-[220px] justify-center md:min-h-[280px] md:justify-start">
          <img
            src="/images/qrpay.webp"
            className="h-72 min-h-[248px] w-auto min-w-[250px] rounded-lg border border-gray-200 object-contain md:w-[280px]"
          />
        </div>

        {/* Download + instructions */}
        <div className="flex flex-col gap-4">
          {/* Download link */}
          <button
            type="button"
            onClick={onDownload}
            className="self-start text-sm font-medium text-blue-600 hover:underline focus:outline-none"
          >
            {t.paymentMethod.downloadQr}
          </button>
          {/* instructions */}
          <ol className="list-inside list-decimal space-y-2 pl-1 text-sm leading-relaxed text-gray-700">
            <li>{t.paymentMethod.instructions}</li>
            <li>{t.paymentMethod.instructionsTitle}</li>
            <li>{t.paymentMethod.instructionsText}</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
