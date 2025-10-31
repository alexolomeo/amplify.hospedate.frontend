import { useState, memo } from 'react';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import LoadingSpinner from '../../Common/LoadingSpinner';
import OptimizedImage from '../../Common/OptimizedImage';

interface Props {
  lang?: SupportedLanguages;
}

type CardProps = {
  index: number | string;
  title: string;
  description: string;
  src: string;
  alt: string;
};

const CoverImage = memo(function CoverImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full max-w-[140px] md:max-w-none">
      <div className="relative aspect-square w-24 md:w-[108px]">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner message="" />
          </div>
        )}

        <OptimizedImage
          src={src}
          alt={alt}
          srcSet={
            src.includes('cover-card')
              ? `${src.replace('.webp', '-320w.webp')} 320w, ${src} 481w`
              : undefined
          }
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={[
            'h-full w-full rounded-[20px] object-cover',
            'transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          sizes="(max-width: 768px) 6rem, 108px"
        />
      </div>
    </div>
  );
});

const Card = ({ index, title, description, src, alt }: CardProps) => (
  <div className="flex h-full flex-1 flex-col justify-between gap-6 rounded-2xl p-2">
    <div className="w-[20px] text-3xl leading-9 font-semibold text-[var(--color-base-content)]">
      {index}
    </div>
    <div className="flex w-full flex-col">
      <h3 className="text-2xl font-semibold text-[var(--color-base-content)] md:text-3xl">
        {title}
      </h3>
      <p className="text-base text-[var(--color-neutral)]">{description}</p>
    </div>

    <CoverImage src={src} alt={alt} />
  </div>
);

export default function CreateListingCover({ lang = 'es' }: Props) {
  const t = getTranslation(lang);

  return (
    <div className="flex flex-col gap-6 bg-[var(--color-base-100)] px-4 py-6 md:gap-20 md:px-0 md:py-0">
      {/* Title */}
      <h1 className="text-[28px] leading-none font-bold md:text-5xl">
        <span className="text-[var(--color-base-content)]">
          {translate(
            t,
            'createListing.wizardStepContent.createListingCover.headingStart'
          ) + ' '}
        </span>
        <span className="font-bold text-[var(--color-primary)]">
          {translate(
            t,
            'createListing.wizardStepContent.createListingCover.headingMiddle'
          ) + ' '}
        </span>
        <span className="text-[var(--color-base-content)]">
          {translate(
            t,
            'createListing.wizardStepContent.createListingCover.headingEnd'
          ) + ' '}
        </span>
        <span className="font-bold text-[var(--color-secondary)]">
          {translate(
            t,
            'createListing.wizardStepContent.createListingCover.headingHighlight'
          )}
        </span>
      </h1>

      {/* Cards */}
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3 md:gap-10">
        <Card
          index={1}
          title={translate(
            t,
            'createListing.wizardStepContent.createListingCover.firstTitle'
          )}
          description={translate(
            t,
            'createListing.wizardStepContent.createListingCover.firstDescription'
          )}
          src="/images/create-listing/cover-card-1.webp"
          alt="step1"
        />
        <Card
          index={2}
          title={translate(
            t,
            'createListing.wizardStepContent.createListingCover.secondTitle'
          )}
          description={translate(
            t,
            'createListing.wizardStepContent.createListingCover.secondDescription'
          )}
          src="/images/create-listing/cover-card-2.webp"
          alt="step2"
        />
        <Card
          index={3}
          title={translate(
            t,
            'createListing.wizardStepContent.createListingCover.thirdTitle'
          )}
          description={translate(
            t,
            'createListing.wizardStepContent.createListingCover.thirdDescription'
          )}
          src="/images/create-listing/cover-card-3.webp"
          alt="step3"
        />
      </div>
    </div>
  );
}
