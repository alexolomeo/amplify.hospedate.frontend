import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface Props {
  lang?: SupportedLanguages;
}

export default function PaymentConfirmation({ lang = 'es' }: Props) {
  const t = getTranslation(lang);

  return (
    <section className="mx-auto my-8 max-w-4xl rounded-3xl border border-[var(--color-base-300)] bg-white p-8 shadow-sm md:p-12">
      <h2 className="mb-8 text-2xl font-bold text-[var(--color-base-content)] md:text-3xl">
        {t.paymentMethod.qrResult}
      </h2>

      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="relative flex flex-1 justify-center">
          <img className="w-[320px] max-w-xs object-contain md:max-w-md" />
          <img
            className="absolute bottom-0 left-1/2 w-[90px] -translate-x-1/2 drop-shadow-lg md:w-[120px]"
            style={{ zIndex: 10 }}
          />
        </div>
        <div className="relative flex flex-1 justify-center"></div>

        <div className="flex flex-1 flex-col items-start gap-6">
          <p className="text-sm font-semibold text-green-700">
            {t.paymentMethod.complete}
          </p>
          <p className="text-xl leading-snug font-bold text-[var(--color-base-content)] md:text-2xl">
            {t.paymentMethod.completeBooking}{' '}
            <span className="underline">{t.paymentMethod.completeReserve}</span>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
