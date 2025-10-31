import React from 'react';
import type { Photo } from '@/types/listing/space';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import AvatarDisplay from './AvatarDisplay';
// import PencilSquareIcon from '/src/icons/pencil-square.svg?react';
import TrophyIcon from '/src/icons/trophy.svg?react';
import { getDurationText } from '@/utils/dateUtils';

interface Props {
  profilePicture: Photo;
  username: string;
  isSuperHost: boolean;
  isHost: boolean;
  totalReviews: number | null;
  becameAt: string | undefined;
  score: number | null;
  id: number;
  enableClick: boolean;
  isOwnProfile: boolean;
  trips?: number | null;
  lang?: SupportedLanguages;
}
const HostCard: React.FC<Props> = ({
  profilePicture,
  username,
  isHost,
  isSuperHost,
  totalReviews,
  becameAt,
  score,
  id,
  enableClick = true,
  isOwnProfile = false,
  trips,
  lang = 'es',
}) => {
  const t = getTranslation(lang);
  const reviewsText = t.listingDetail.host.reviews;
  const scoreText = t.listingDetail.host.score;
  const tripsText = t.listingDetail.host.trips;
  const becomeHostText = isHost
    ? t.listingDetail.host.becameHostAt
    : t.listingDetail.host.becameUserAt;
  const regularHostText = t.listingDetail.host.regularhost;
  const guestText = t.listingDetail.host.guest;
  const superHostText = t.listingDetail.host.superhost;
  return (
    <a
      href={enableClick ? `/users/${id}` : undefined}
      tabIndex={enableClick ? 0 : -1}
      aria-hidden={!enableClick ? 'true' : undefined}
      className={` ${enableClick ? 'cursor-pointer' : ''}`}
    >
      <div className="border-base-200 space-y-2 rounded-4xl border px-5 py-8 text-center">
        <div className="flex items-center justify-center">
          <AvatarDisplay
            profilePicture={profilePicture}
            username={username}
            size="h-24 w-24"
            sizeText="text-4xl"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-primary self-stretch text-lg font-semibold">
            {username}
          </p>
          {isSuperHost ? (
            <div className="flex items-center text-xs leading-tight">
              <TrophyIcon className="text-accent h-4" />
              {superHostText}
            </div>
          ) : isHost ? (
            <div className="text-xs leading-tight">{regularHostText}</div>
          ) : (
            <div className="text-xs leading-tight">{guestText}</div>
          )}
        </div>
        {isOwnProfile ? (
          <div className="space-y-1 text-base">
            {totalReviews && totalReviews > 0 && (
              <div className="border-base-200 flex items-center justify-between border-b">
                <div className="text-xs leading-3">{reviewsText}</div>
                <div className="text-secondary font-bold">{totalReviews}</div>
              </div>
            )}
            {isHost
              ? score != null &&
                score > 0 && (
                  <div className="border-base-200 flex items-center justify-between border-b">
                    <div className="text-xs leading-3">{scoreText}</div>
                    <div className="text-secondary font-bold">{score}</div>
                  </div>
                )
              : trips != null &&
                trips > 0 && (
                  <div className="border-base-200 flex items-center justify-between border-b">
                    <div className="text-xs leading-3">{tripsText}</div>
                    <div className="text-secondary font-bold">{trips}</div>
                  </div>
                )}
            <div className="flex items-center justify-between">
              <div className="text-xs leading-3">{becomeHostText}</div>
              <div className="text-secondary font-bold">
                {becameAt ? getDurationText(becameAt, lang) : ''}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-x-4 text-base">
            {totalReviews && totalReviews > 0 && (
              <div>
                <div className="text-secondary font-bold">{totalReviews}</div>
                <div className="text-xs leading-3">{reviewsText}</div>
              </div>
            )}
            {isHost
              ? score != null &&
                score > 0 && (
                  <div>
                    <div className="text-secondary font-bold">{score}</div>
                    <div className="text-xs leading-3">{scoreText}</div>
                  </div>
                )
              : trips != null &&
                trips > 0 && (
                  <div>
                    <div className="text-secondary font-bold">{trips}</div>
                    <div className="text-xs leading-3">{tripsText}</div>
                  </div>
                )}
            {totalReviews && score && totalReviews > 0 && score > 0 && (
              <div>
                <div className="text-secondary font-bold">
                  {becameAt ? getDurationText(becameAt, lang) : ''}
                </div>
                <div className="text-xs leading-3">{becomeHostText}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </a>
  );
};
export default HostCard;
