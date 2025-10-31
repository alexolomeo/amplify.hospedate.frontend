import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { Trip, User } from '@/types/user';
import { getSafeArray } from '@/utils/displayHelpers';
import TripProfileIcon from '/src/icons/trip-profile.svg?react';
import CarouselContainer from '../Common/CarouselContainer';

interface Props {
  lang?: SupportedLanguages;
  user: User;
  isOwnProfile?: boolean;
}
const Trips: React.FC<Props> = ({
  lang = 'es',
  user,
  isOwnProfile = false,
}) => {
  const t = getTranslation(lang);
  const safeTrips = getSafeArray(user.trips, []);

  return (
    <div>
      {safeTrips.length != 0 && (
        <div className="space-y-5 py-7">
          <CarouselContainer
            title={
              isOwnProfile
                ? t.profile.tripsWithUs
                : translate(t, 'profile.visitedPlaces', {
                    username: user.username,
                  })
            }
            scrollAmount={0.5}
          >
            {safeTrips.map((trip: Trip, index: number) => (
              <div key={index} className="flex-col items-center justify-center">
                <TripProfileIcon className="text-secondary h-[108px] w-[146px]" />
                <p className="text-neutral pt-2 text-center text-xs font-bold">
                  {trip.country}
                </p>
                <p className="text-neutral text-center text-xs font-normal">
                  {trip.city}
                </p>
              </div>
            ))}
          </CarouselContainer>
        </div>
      )}
    </div>
  );
};

export default Trips;
