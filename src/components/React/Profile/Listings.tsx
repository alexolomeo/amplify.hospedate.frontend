import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { User } from '@/types/user';
import { getSafeArray } from '@/utils/displayHelpers';
import CarouselContainer from '../Common/CarouselContainer';
import { ResponsiveImage } from '../Common/ResponsiveImage';
import StarIcon from '/src/icons/star.svg?react';

interface Props {
  lang?: SupportedLanguages;
  user: User;
}
const listings: React.FC<Props> = ({ lang = 'es', user }) => {
  const t = getTranslation(lang);
  const safeListings = getSafeArray(user.listings, []);

  return (
    <div>
      {safeListings.length != 0 && (
        <div className="space-y-5 py-8">
          <CarouselContainer
            title={translate(t, 'profile.listings', {
              username: user.username,
            })}
            scrollAmount={0.5}
          >
            {safeListings.map((listing, index: number) => (
              <a
                key={index}
                className="carousel-item w-[250px]"
                href={`/listing/${listing.id}`}
              >
                <div className="flex w-full cursor-pointer flex-col overflow-hidden rounded-[16px] bg-[var(--color-base-100)]">
                  <div className="relative aspect-square h-[236.8px] w-full overflow-hidden rounded-[16px]">
                    <ResponsiveImage
                      photo={listing.photo}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2 px-0 py-3">
                    <div className="flex flex-col gap-[2px]">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="max-w-[320px] flex-1 truncate text-lg leading-5 font-semibold text-[var(--color-base-content)]">
                          {listing.title}
                        </h3>
                        {listing.score && (
                          <div className="flex items-center gap-[2px] text-xs font-normal text-[var(--color-base-content)]">
                            <StarIcon className="text-accent h-5 w-5" />
                            {listing.score.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </CarouselContainer>
        </div>
      )}
    </div>
  );
};

export default listings;
