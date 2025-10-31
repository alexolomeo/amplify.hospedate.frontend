import type React from 'react';

import type { Slug } from '@/components/React/Utils/edit-listing/slugs';
import KitchenIcon from '/src/icons/amenities/kitchen.svg?react';
import TvIcon from '/src/icons/amenities/tv.svg?react';
import WifiIcon from '/src/icons/amenities/wifi.svg?react';

import Guest from '/src/icons/house-rules/guest-number.svg?react';
import Clock from '/src/icons/house-rules/clock.svg?react';

import Smoke from '/src/icons/safety-property/smoke-detector.svg?react';
import Co from '/src/icons/smoke-detector-2.svg?react';

export type SidebarMeta = {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconClassName?: string;

  image?: string;
  imageClassName?: string;
  titleClassName?: string;
  subtextClassName?: string;
  chip?: { text: string; className?: string };
  cardClassName?: string;

  subtextLayout?: 'text' | 'stack' | 'bullets';
  subtextSplitOn?: string | RegExp;

  subtextItemIconMap?: Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
  >;
  subtextItemIconClassName?: string;

  itemIconUrlMap?: Record<string, string>;
  subtextItemImgClassName?: string;
};

export const placeMetaBySlug: Partial<Record<Slug, SidebarMeta>> = {
  amenities: {
    iconClassName: 'text-green-500',
    subtextLayout: 'bullets',
    subtextClassName: 'text-xs text-[var(--color-base-content)]',
    // This has no sense to be use it like this. Reuse better AppIcon from '@/components/React/Common/AppIcon';
    subtextItemIconMap: {
      kitchen: KitchenIcon,
      tv: TvIcon,
      wifi: WifiIcon,

      Cocina: KitchenIcon,
      TV: TvIcon,
      Wifi: WifiIcon,
    },
    subtextItemIconClassName: 'text-green-500',
  },
  'house-rules': {
    iconClassName: 'text-green-500',
    subtextLayout: 'bullets',
    subtextClassName: 'text-xs text-[var(--color-base-content)]',

    subtextItemIconMap: {
      checkin: Clock,
      guests: Guest,
    },
    subtextItemIconClassName: 'text-green-500',
  },
  'guest-safety': {
    iconClassName: 'text-green-500',
    subtextLayout: 'bullets',
    subtextClassName: 'text-xs text-[var(--color-base-content)]',

    subtextItemIconMap: {
      co: Co,
      smoke: Smoke,
    },
    subtextItemIconClassName: 'text-green-500',
  },
  'photo-gallery': {
    image: '/images/reference-img-listing.webp',
    subtextClassName: 'text-xs text-[var(--color-base-content)]',
  },
  description: {
    subtextLayout: 'text',
    subtextClassName: 'text-xs text-[var(--color-base-content)]',
    iconClassName: 'text-green-500',
  },
  address: {
    subtextLayout: 'text',
    subtextClassName: 'text-xs text-neutral-700',
  },
  availability: {
    subtextLayout: 'stack',
    subtextClassName: 'text-xs text-[var(--color-base-content)]',
  },
  booking: {
    subtextLayout: 'text',
    subtextClassName: 'text-xs text-[var(--color-base-content)]',
  },
};

export const StatusPill: React.FC<{
  active: boolean;
  labelOn: string;
  onClick: () => void;
}> = ({ active, labelOn, onClick }) => {
  const wrapperCls = active
    ? 'bg-green-600 text-white border-green-600'
    : 'bg-transparent text-green-700 border-green-600';

  const dotCls = active ? 'bg-white' : 'bg-green-700';

  return (
    <button type="button" onClick={onClick} className="mt-2 w-full">
      <div
        className={`relative w-full rounded-full border px-3 py-1 text-xs transition-colors ${wrapperCls}`}
      >
        <span
          className={`absolute top-1/2 left-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${dotCls}`}
        />
        <div className="cursor-pointer text-center">{labelOn}</div>
      </div>
    </button>
  );
};
