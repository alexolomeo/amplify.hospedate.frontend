import React from 'react';
import MessageBubbleSkeleton from './MessageBubbleSkeleton.tsx';

type Props = {
  count?: number;
};

export default function MessageHistorySkeleton({ count = 5 }: Props) {
  return (
    <div className="flex flex-col pt-2">
      {Array.from({ length: count }).map((_, i) => (
        <MessageBubbleSkeleton
          key={i}
          align={i % 2 === 0 ? 'left' : 'right'}
          showAvatar={true}
          lines={i % 3 === 0 ? 3 : 2}
        />
      ))}
    </div>
  );
}
