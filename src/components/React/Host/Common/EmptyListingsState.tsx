import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import PlusMiniIcon from '@/icons/plus-mini.svg?react';
import { navigate } from 'astro:transitions/client';

interface Props {
  lang: SupportedLanguages;
}

export default function EmptyListingsState({ lang }: Props) {
  const t = getTranslation(lang);
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-[330px] w-full flex-col items-center justify-center gap-6">
        <div
          className="h-[214px] w-[317px] bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/host/listings/empty-listings.webp')`,
          }}
        />
        <p className="text-neutral w-[269px] text-center text-sm leading-5">
          {t.hostContent.listings.emptyDescription}
        </p>
        <button
          className="bg-primary hover:bg-primary/90 text-primary-content flex h-12 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold shadow-sm transition"
          onClick={() => navigate('/listing/create')}
        >
          <PlusMiniIcon className="h-4 w-4" />
          {t.hostContent.listings.addListing}
        </button>
      </div>
    </div>
  );
}
