import { type SupportedLanguages } from '@/utils/i18n';
import EditSpace from './EditSpace';
import type { GalleryNav } from '@/types/host/edit-listing/galleryNav';

interface Props {
  lang?: SupportedLanguages;
  spaceId: number;
  nav: GalleryNav;
  listingId: string;
  onRefresh?: () => Promise<void>;
}

export default function ShowSpaces({
  lang = 'es',
  nav,
  listingId,
  spaceId,
  onRefresh,
}: Props) {
  return (
    <div>
      <EditSpace
        lang={lang}
        spaceId={spaceId}
        nav={nav}
        listingId={listingId}
        onRefresh={onRefresh}
      />
    </div>
  );
}
