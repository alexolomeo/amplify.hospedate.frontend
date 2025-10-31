import React, { useState } from 'react';
import clsx from 'clsx';

interface ListingMarkerProps {
  showMarker: boolean;
  message: string;
  selected?: boolean;
  hoveredFromCard?: boolean;
}

export default function ListingMarker({
  showMarker,
  message,
  selected,
  hoveredFromCard,
}: ListingMarkerProps) {
  const [hovered, setHovered] = useState(false);

  const isSelected = selected ?? false;
  const isHoveredFromCard = hoveredFromCard ?? false;

  const visible = showMarker || hovered || isSelected || isHoveredFromCard;

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  const baseZIndex = isSelected ? 300 : isHoveredFromCard ? 250 : 200;

  return (
    <div
      aria-label={message}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={(e) => {
        if (isSelected) e.stopPropagation();
      }}
      className={clsx(
        'transition-transform duration-150 ease-in-out select-none',
        visible
          ? [
              'inline-flex items-center justify-center gap-2',
              'px-2 py-1',
              'border border-[#42A200]',
              isSelected || isHoveredFromCard
                ? 'bg-[#42A200] text-white'
                : 'bg-white text-gray-800',
              'rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-none',
              isSelected ? 'cursor-default' : 'cursor-pointer hover:scale-110',
            ]
          : 'h-3 w-5 rounded-full bg-[#42A200]'
      )}
      style={{ zIndex: baseZIndex }}
    >
      {visible && (
        <span className="font-sans text-sm leading-tight font-medium tracking-wide">
          {message}
        </span>
      )}
    </div>
  );
}
