import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { User } from '@/types/user';
import { getSafeArray } from '@/utils/displayHelpers';
import CarouselContainer from '../Common/CarouselContainer';
import type { RecentReviews } from '@/types/listing/review';
import ReviewItem from '../Common/ReviewItem';

interface Props {
  lang?: SupportedLanguages;
  user: User;
}
const Reviews: React.FC<Props> = ({ lang = 'es', user }) => {
  const t = getTranslation(lang);
  if (!user.reviews) {
    return null;
  }
  const safeRevies = getSafeArray(
    user.isHost ? user.reviews.fromGuests : user.reviews.fromHosts,
    []
  );
  return (
    <div>
      {safeRevies.length != 0 && (
        <div className="space-y-5 py-8">
          <CarouselContainer
            title={translate(t, 'profile.reviews', { username: user.username })}
            scrollAmount={0.5}
          >
            {safeRevies.map((reviews: RecentReviews, index: number) => (
              <div key={index} className="carousel-item">
                <ReviewItem
                  review={reviews}
                  truncateComment={false}
                  lang={lang}
                />
              </div>
            ))}
          </CarouselContainer>
        </div>
      )}
    </div>
  );
};

export default Reviews;
