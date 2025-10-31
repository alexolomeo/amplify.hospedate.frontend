import { useState } from 'react';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import LoadingSpinner from '@/components/React/Common/LoadingSpinner';
import OptimizedImage from '@/components/React/Common/OptimizedImage';

interface Props {
  lang?: SupportedLanguages;
}

export default function PlaceInformationCover({ lang = 'es' }: Props) {
  const t = getTranslation(lang);
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="flex flex-col items-center gap-8 bg-[var(--color-base-100)] px-6 py-6 md:flex-row md:gap-20 md:px-0 md:py-0">
      {/* Left side */}
      <div className="flex flex-1 flex-col items-start justify-center gap-4 text-center md:text-left">
        <span className="text-sm leading-5 font-semibold text-[var(--color-base-content)]">
          {translate(
            t,
            'createListing.wizardStepContent.placeInformationCover.stepLabel'
          )}
        </span>
        <h1 className="text-4xl leading-none font-bold text-[var(--color-base-content)] md:text-5xl">
          {translate(
            t,
            'createListing.wizardStepContent.placeInformationCover.title'
          )}
        </h1>
        <p className="text-base leading-6 font-normal text-[var(--color-neutral)]">
          {translate(
            t,
            'createListing.wizardStepContent.placeInformationCover.description'
          )}
        </p>
      </div>

      {/* Right side */}
      <div className="flex w-full flex-1 justify-center overflow-hidden">
        <div className="relative w-full max-w-[420px] overflow-hidden rounded-[20px] sm:max-w-[520px] md:max-w-[560px] lg:max-w-[600px] xl:max-w-[640px]">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-base-100)]/70">
              <LoadingSpinner message="" />
            </div>
          )}

          <OptimizedImage
            src="/images/create-listing/place-information/cover.webp"
            srcSet="/images/create-listing/place-information/cover-320w.webp 320w, /images/create-listing/place-information/cover-640w.webp 640w, /images/create-listing/place-information/cover-1024w.webp 1024w, /images/create-listing/place-information/cover-1920w.webp 1920w"
            alt="Place information cover"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={[
              'h-auto w-full rounded-[20px]',
              'max-h-[300px] md:max-h-[360px] lg:max-h-[392px]',
              'object-contain',
              'transition-opacity duration-300',
              loaded ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
            sizes="(min-width: 1280px) 640px, (min-width: 1024px) 600px, (min-width: 768px) 560px, (min-width: 640px) 520px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
