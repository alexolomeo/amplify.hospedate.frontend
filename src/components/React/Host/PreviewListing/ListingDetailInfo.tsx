import * as React from 'react';

import AvatarDisplay from '@/components/React/Common/AvatarDisplay';
import StarRating from '@/components/React/Common/StarRating';
import { getSafeText } from '@/utils/displayHelpers';
import { formatAddress } from '@/utils/formatAddress';
import {
  getTranslation,
  translatePlural,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { ListingDetail } from '@/types/listing/listing';

type Props = {
  listing: ListingDetail;
  lang?: SupportedLanguages;
  /** Si también renderizas <ListingDetailHost />, pon esto en false para evitar duplicación */
  showHost?: boolean;
};
const isFiniteNumber = (n: unknown): n is number =>
  typeof n === 'number' && Number.isFinite(n);
export default function ListingDetailInfo({
  listing,
  lang = 'es',
  showHost = true,
}: Props) {
  const t = React.useMemo(() => getTranslation(lang), [lang]);

  const hostScore = listing.host?.score;
  const showStars = isFiniteNumber(hostScore) && hostScore > 0;

  const capacityItems = React.useMemo(
    () => [
      { key: 'guest', value: listing.placeInfo.guestNumber },
      { key: 'room', value: listing.placeInfo.roomNumber },
      { key: 'bed', value: listing.placeInfo.bedNumber },
      { key: 'bathroom', value: listing.placeInfo.bathNumber },
    ],
    [listing.placeInfo]
  );

  return (
    <div>
      {/* Título / dirección */}
      <div className="py-8">
        <h2 className="title-listing">
          {getSafeText(formatAddress(listing), lang)}
        </h2>

        <div className="inline-flex items-center justify-start gap-2 self-stretch lg:gap-4">
          {capacityItems.map((item, index) => (
            <React.Fragment key={item.key}>
              <span className="text-neutral justify-center text-xs leading-7 font-normal md:text-sm lg:text-sm">
                {translatePlural(
                  t,
                  `listingDetail.capacity.${item.key}`,
                  item.value
                )}
              </span>
              {index < capacityItems.length - 1 && (
                <span className="text-neutral text-xs">●</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Host */}
      {showHost && (
        <div className="flex items-center gap-4 py-8">
          <div className="avatar">
            <a
              className="flex h-24 w-24 cursor-pointer"
              href={`/users/${listing.host.id}`}
              aria-label="View host profile"
              tabIndex={0}
            >
              <AvatarDisplay
                profilePicture={listing.host.profilePicture}
                username={listing.host.username}
                size="h-24 w-24"
                sizeText="text-4xl"
              />
            </a>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xs">{t.listingDetail.host.title}</span>
            <span className="text-lg font-semibold">
              {getSafeText(listing.host.username, lang)}
            </span>

            <div className="flex items-center gap-2">
              {showStars ? (
                <StarRating rating={hostScore} size="w-6 h-6" />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
