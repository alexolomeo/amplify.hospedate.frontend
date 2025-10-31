import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { Rating } from '@/types/listing/rating';
import CleanIcon from '/src/icons/clean.svg?react';
import CheckBadgeIcon from '/src/icons/check-badge.svg?react';
import KeyIcon from '/src/icons/key.svg?react';
import ChatBubbleIcon from '/src/icons/chat-bubble.svg?react';
import MapPinIcon from '/src/icons/map-pin.svg?react';
import CurrencyDollarIcon from '/src/icons/currency-dolar.svg?react';

interface Props {
  rating: Rating;
  isModal?: boolean;
  lang?: SupportedLanguages;
}

const RatingCategory: React.FC<Props> = ({
  rating,
  isModal = false,
  lang = 'es',
}) => {
  const t = getTranslation(lang);
  const categories = [
    {
      label: t.listingDetail.rating.categories.cleanliness,
      value: rating.ratingCategories.cleanliness,
      icon: CleanIcon,
    },
    {
      label: t.listingDetail.rating.categories.accuracy,
      value: rating.ratingCategories.accuracy,
      icon: CheckBadgeIcon,
    },
    {
      label: t.listingDetail.rating.categories.checkIn,
      value: rating.ratingCategories.checkIn,
      icon: KeyIcon,
    },
    {
      label: t.listingDetail.rating.categories.communication,
      value: rating.ratingCategories.communication,
      icon: ChatBubbleIcon,
    },
    {
      label: t.listingDetail.rating.categories.location,
      value: rating.ratingCategories.location,
      icon: MapPinIcon,
    },
    {
      label: t.listingDetail.rating.categories.value,
      value: rating.ratingCategories.value,
      icon: CurrencyDollarIcon,
    },
  ];
  const CompactCard = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    value: number;
  }) => (
    <div
      className="border-secondary-content flex w-full max-w-[115px] flex-col gap-4 rounded-lg border p-6"
      data-testid={`compact-card-${label}`}
    >
      <Icon className="text-secondary h-8 w-8" />
      <div>
        <div className="text-base">{value.toFixed(1)}</div>
        <div className="text-neutral text-xs font-normal">{label}</div>
      </div>
    </div>
  );

  const RowCard = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    value: number;
  }) => (
    <div
      className="flex w-full justify-between p-2"
      data-testid={`row-card-${label}`}
    >
      <div className="flex gap-2">
        <Icon className="text-secondary h-5 w-5" />
        <div className="text-neutral text-xs font-normal">{label}</div>
      </div>
      <div className="text-xs">{value.toFixed(1)}</div>
    </div>
  );

  return isModal ? (
    <>
      <div className="hidden lg:block">
        {categories.map((item, idx) => (
          <RowCard key={idx} {...item} />
        ))}
      </div>
      <div className="flex w-full gap-6 lg:hidden">
        {categories.map((item, idx) => (
          <CompactCard key={idx} {...item} />
        ))}
      </div>
    </>
  ) : (
    <div className="flex w-full flex-wrap gap-6">
      {categories.map((item, idx) => (
        <CompactCard key={idx} {...item} />
      ))}
    </div>
  );
};

export default RatingCategory;
