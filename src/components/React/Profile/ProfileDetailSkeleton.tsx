import React from 'react';

const ProfileDetailSkeleton: React.FC = () => {
  return (
    <section className="px-4 py-3 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="grid grid-cols-1 space-y-8 gap-x-10 md:grid-cols-5 lg:grid-cols-4">
        <div className="col-span-1 space-y-8 md:col-span-2 lg:col-span-1">
          <div className="h-6 w-20 rounded-2xl bg-[var(--color-base-150)]"></div>
          <div className="h-60 self-stretch rounded-[40px] bg-[var(--color-base-150)]"></div>
        </div>
        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          <div className="inline-flex flex-col items-start justify-start gap-14 self-stretch">
            <div className="bg-base-200 h-8 w-72 rounded-2xl"></div>
            <div className="flex flex-col items-start justify-start gap-4 self-stretch">
              <div className="bg-base-200 h-6 w-36 rounded-2xl"></div>
              <div className="h-32 self-stretch rounded-[30px] bg-[var(--color-base-150)]"></div>
            </div>
            <div className="flex flex-col items-start justify-start gap-4 self-stretch">
              <div className="bg-base-200 h-6 w-36 rounded-2xl"></div>
              <div className="h-32 self-stretch rounded-[30px] bg-[var(--color-base-150)]"></div>
            </div>
            <div className="flex flex-col items-start justify-start gap-4 self-stretch">
              <div className="bg-base-200 h-6 w-36 rounded-2xl"></div>
              <div className="inline-flex flex-wrap content-start items-start justify-start gap-4 self-stretch">
                <div className="h-6 w-44 rounded-[30px] bg-[var(--color-base-150)]"></div>
                <div className="h-6 w-32 rounded-[30px] bg-[var(--color-base-150)]"></div>
                <div className="h-6 w-24 rounded-[30px] bg-[var(--color-base-150)]"></div>
                <div className="h-6 w-48 rounded-[30px] bg-[var(--color-base-150)]"></div>
                <div className="h-6 w-32 rounded-[30px] bg-[var(--color-base-150)]"></div>
                <div className="h-6 w-32 rounded-[30px] bg-[var(--color-base-150)]"></div>
                <div className="h-6 w-60 rounded-[30px] bg-[var(--color-base-150)]"></div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-4 self-stretch">
              <div className="bg-base-200 h-6 w-36 rounded-2xl"></div>
              <div className="inline-flex items-start justify-start gap-4 self-stretch">
                <div className="h-32 flex-1 rounded-[30px] bg-[var(--color-base-150)]"></div>
                <div className="h-32 flex-1 rounded-[30px] bg-[var(--color-base-150)]"></div>
                <div className="h-32 flex-1 rounded-[30px] bg-[var(--color-base-150)]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileDetailSkeleton;
