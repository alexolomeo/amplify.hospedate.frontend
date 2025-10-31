import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface CancellationPolicyProps {
  lang?: SupportedLanguages;
}

export default function CancellationPolicy({
  lang = 'es',
}: CancellationPolicyProps) {
  const t = getTranslation(lang);

  return (
    <section className="flex w-full flex-col gap-8">
      <section className="flex w-full flex-col gap-4">
        <p className="text-neutral text-sm leading-5">
          {t.booking.policy.acceptancePolicy}
        </p>
        <p className="text-sm leading-5">
          {t.booking.policy.acceptance}
          <a href="/terms" className="text-primary underline">
            {t.booking.policy.terms}
          </a>
          <span> , </span>
          <a href="/privacy" className="text-primary underline">
            {t.booking.policy.privacy}
          </a>
        </p>
      </section>
    </section>
  );
}
