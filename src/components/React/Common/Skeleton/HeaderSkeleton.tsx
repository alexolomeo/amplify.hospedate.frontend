import React from 'react';

export const HeaderSkeleton: React.FC = () => {
  return (
    <nav className="flex min-h-16 w-full px-4 py-3 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="flex items-center justify-center px-1">
        <a href="/" className="bg-base-300 flex items-center gap-2"></a>
      </div>
      <div className="bg-base-300 flex flex-1 items-center justify-center rounded-full">
        <div className="bg-base-300 w-full max-w-full md:max-w-[90%] lg:max-w-[645px]"></div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <div className="bg-base-300 hidden items-center text-center md:flex"></div>
        <div className="bg-base-300 hidden items-center gap-2 text-center md:flex"></div>
      </div>
    </nav>
  );
};
