import AppIcon from '@/components/React/Common/AppIcon';
import { memo } from 'react';

export interface ItemLite {
  key: string;
  label: string;
}

interface Props {
  title?: string;
  items: ItemLite[];
  folder: string;
  hideIconForKey?: string;
}

export const IconListing = memo(function AmenityList({
  title,
  items,
  folder,
  hideIconForKey,
}: Props) {
  return (
    <div>
      {title && <p className="pb-6 font-bold">{title}</p>}

      <div className="mt-1 flex list-none flex-col gap-1 pl-0 text-xs">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-start gap-2">
            {item.key !== hideIconForKey && (
              <AppIcon
                iconName={item.key}
                folder={folder}
                className="text-secondary h-4 w-4"
                loaderCompact
              />
            )}
            <p className="text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
});
