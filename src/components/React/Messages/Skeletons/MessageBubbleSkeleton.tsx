import React from 'react';

type Props = {
  align?: 'left' | 'right';
  showAvatar?: boolean;
  lines?: number;
};

export default function MessageBubbleSkeleton({
  align = 'left',
  showAvatar = true,
  lines = 2,
}: Props) {
  // Create line width variety for a more natural look
  const widths = ['w-5/6', 'w-4/6', 'w-3/6', 'w-2/3', 'w-1/2'];

  return (
    <div
      className={[
        'flex w-full items-end',
        align === 'right' ? 'justify-end' : 'justify-start',
        'mt-3',
      ].join(' ')}
    >
      <div
        className={[
          'flex items-end gap-2',
          align === 'right' ? 'flex-row-reverse' : '',
        ].join(' ')}
      >
        {/* Avatar placeholder (only for the first bubble of block-like feeling) */}
        {showAvatar ? (
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200 [animation-duration:.8s]" />
        ) : (
          <div className="h-10 w-10 shrink-0" />
        )}

        {/* Bubble placeholder */}
        <div
          className={[
            'rounded-2xl px-4 py-3',
            align === 'right' ? 'bg-gray-200' : 'bg-[var(--color-base-150)]',
            'max-w-[72vw] min-w-[8rem] md:max-w-[28rem]',
          ].join(' ')}
        >
          <div className="flex flex-col gap-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className={[
                  'h-3 animate-pulse rounded bg-gray-300 [animation-duration:.8s]',
                  widths[i % widths.length],
                ].join(' ')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
