import React from 'react';

export default function ConversationCardSkeleton() {
  return (
    <div className="flex w-full items-center gap-4 rounded-2xl p-3">
      {/* Place image skeleton */}
      <div className="relative h-14 w-14 shrink-0">
        <div className="h-14 w-14 animate-pulse rounded-2xl bg-gray-400 [animation-duration:0.7s]" />
        <div className="absolute -top-2 -right-2 h-8 w-8 animate-pulse rounded-full border-2 border-white bg-gray-400 [animation-duration:0.7s]" />
      </div>

      {/* Text skeletons */}
      <div className="flex min-w-0 flex-1 flex-col space-y-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-400 [animation-duration:0.7s]" />
        <div className="h-3 w-full animate-pulse rounded bg-gray-400 [animation-duration:0.7s]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-400 [animation-duration:0.7s]" />
      </div>
    </div>
  );
}
