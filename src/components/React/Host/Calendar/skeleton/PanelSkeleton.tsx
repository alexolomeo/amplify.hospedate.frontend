import React from 'react';

const PanelSkeleton: React.FC = () => {
  return (
    <div className="bg-base-100 inline-flex h-[673px] w-full flex-col items-center justify-start gap-6 overflow-hidden pt-5 pb-10">
      <div className="inline-flex items-center justify-between self-stretch">
        <div className="bg-base-200 h-7 w-32 rounded-2xl"></div>
        <div className="px- flex h-6 items-center justify-center gap-2 rounded-2xl bg-[var(--color-base-150)]">
          <div className="relative h-5 w-5 overflow-hidden">
            <div className="absolute top-[3.50px] left-[3.50px] h-1.5 w-1.5"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start gap-2 self-stretch">
        <div className="h-8 self-stretch rounded-2xl bg-sky-50"></div>
        <div className="h-8 w-28 rounded-2xl bg-sky-50"></div>
      </div>
      <div className="bg-base-200 inline-flex h-14 items-center justify-start gap-4 self-stretch rounded-[40px] px-4 py-3"></div>
      <div className="h-7 w-32 rounded-2xl bg-sky-50"></div>
      <div className="h-12 w-80 rounded-2xl bg-sky-50"></div>
      <div className="flex flex-col items-start justify-start gap-4 self-stretch">
        <div className="inline-flex items-start justify-between self-stretch">
          <div className="h-8 w-80 rounded-2xl bg-sky-50"></div>
          <div className="h-8 w-28 rounded-2xl bg-sky-50"></div>
        </div>
        <div className="inline-flex items-start justify-between self-stretch">
          <div className="h-8 w-40 rounded-2xl bg-sky-50"></div>
          <div className="h-8 w-28 rounded-2xl bg-sky-50"></div>
        </div>
      </div>
      <div className="outline-base-200 h-0 self-stretch outline-1 outline-offset-[-0.50px]"></div>
      <div className="flex h-14 flex-col items-start justify-start gap-6 self-stretch">
        <div className="outline-base-200 h-0 self-stretch outline-1 outline-offset-[-0.50px]"></div>
        <div className="outline-base-200 h-0 self-stretch outline-1 outline-offset-[-0.50px]"></div>
      </div>
      <div className="bg-base-200 inline-flex h-14 items-center justify-start gap-4 self-stretch rounded-[40px] px-4 py-3"></div>
    </div>
  );
};

export default PanelSkeleton;
