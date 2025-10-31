import type { RecentReviews } from '@/types/listing/review';
import { getFormattedLocalDate, getSafeText } from '@/utils/displayHelpers';
import type { SupportedLanguages } from '@/utils/i18n';
import { ResponsiveImage } from './ResponsiveImage';
import StarRating from './StarRating';
import UserIcon from '/src/icons/user.svg?react';

interface Props {
  review: RecentReviews;
  truncateComment?: boolean;
  lang?: SupportedLanguages;
}

const ReviewItem: React.FC<Props> = ({
  review,
  truncateComment = false,
  lang = 'es',
}) => {
  return (
    <div
      className={
        truncateComment
          ? 'border-base-200 rounded-[16px] border p-6 text-sm'
          : 'border-base-200 bg-base-100 rounded-[16px] border p-4 text-sm'
      }
    >
      <div className="flex space-x-4">
        <a
          href={`/users/${review.user.id}`}
          className="block flex-none cursor-pointer"
          aria-label={`View profile for ${review.user.username}`}
          tabIndex={0}
        >
          {review.user.profilePicture ? (
            <ResponsiveImage
              photo={review.user.profilePicture}
              alt="Profile Picture"
              className="size-12 rounded-full object-cover"
            />
          ) : (
            <UserIcon className="h-12 w-12" />
          )}
        </a>
        <div className="flex-1">
          <h3 className="text-base leading-normal font-normal">
            {getSafeText(review.user.username, lang)}
          </h3>
          <p className="text-neutral text-xs leading-3 font-normal">
            <time>{getFormattedLocalDate(review.date, lang)}</time>
          </p>
          <div className="flex items-center py-3">
            <StarRating rating={review.score ?? 0} />
          </div>
          {truncateComment && (
            <p className="text-neutral line-clamp-1 text-xs">
              {getSafeText(review.comment, lang)}
            </p>
          )}
          {!truncateComment && (
            <p className="text-neutral text-xs">
              {getSafeText(review.comment, lang)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
