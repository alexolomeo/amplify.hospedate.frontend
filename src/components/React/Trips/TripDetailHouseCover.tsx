import React from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { TripDetail } from '@/types/tripDetail';

interface TripDetailHouseCoverProps {
  tripDetail: TripDetail;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
  LogoComponent?: React.ReactNode;
}

const TripDetailHouseCover: React.FC<TripDetailHouseCoverProps> = ({
  t,
  LogoComponent,
}) => {
  const title = translate(t, 'trips.houseCover');
  const description = translate(t, 'trips.houseCoverDescription');
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base-content text-lg font-bold sm:text-xl">
          {title}
        </h3>
        <div>{LogoComponent}</div>
      </div>
      <p className="m-0 text-gray-600">{description}</p>
    </div>
  );
};

export default TripDetailHouseCover;
