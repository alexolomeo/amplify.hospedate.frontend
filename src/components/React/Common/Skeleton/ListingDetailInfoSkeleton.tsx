import React from 'react';

type Props = {
  ariaLabel?: string;
};

const ListingDetailInfoSkeleton: React.FC<Props> = () => {
  return (
    <section role="status" aria-live="polite" className="animate-pulse">
      <div className="py-8">
        <div className="bg-base-300 h-6 w-2/3 rounded sm:h-7 sm:w-3/4 md:h-8 md:w-2/3 lg:h-9 lg:w-1/2" />

        <div className="mt-3 inline-flex items-center gap-2 lg:gap-4">
          {[0, 1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <div className="bg-base-300 h-4 w-24 rounded md:w-28 lg:w-32" />
              {i < 3 && <span className="text-neutral text-xs">●</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 py-8">
        <div className="bg-base-300 h-24 w-24 rounded-full" />

        <div className="flex flex-col justify-center gap-2">
          <div className="bg-base-300 h-3 w-24 rounded" />
          <div className="bg-base-300 h-6 w-40 rounded" />
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-base-300 h-6 w-6 rounded" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListingDetailInfoSkeleton;
