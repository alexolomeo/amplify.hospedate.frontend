import React from 'react';
import Lightbox from 'yet-another-react-lightbox';

import 'yet-another-react-lightbox/styles.css';
import 'react-photo-album/rows.css';
import type { FormattedPhoto, Space } from '@/types/listing/space';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/counter.css';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import SpaceSection from './SpaceSection';

interface ListingGalleryProps {
  spaces?: Space[];
  spacing?: number;
  lang?: SupportedLanguages;
  initialSpace?: string;
}
const ListingGallery: React.FC<ListingGalleryProps> = ({
  spaces = [],
  spacing = 0,
  lang = 'es',
  initialSpace,
}) => {
  const t = getTranslation(lang);

  const [lightboxData, setLightboxData] = React.useState<{
    index: number;
    slides: FormattedPhoto[];
  } | null>(null);

  const spaceRefs = React.useRef<Record<string, HTMLDivElement | null>>(
    spaces.reduce((acc, space) => ({ ...acc, [space.name]: null }), {})
  );
  React.useEffect(() => {
    if (initialSpace && spaceRefs.current[initialSpace]) {
      const handle = requestAnimationFrame(() => {
        spaceRefs.current[initialSpace]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [initialSpace]);

  const lightboxStyles = {
    root: { '--yarl__color_backdrop': 'rgba(0, 0, 0, .9)' },
  };

  return spaces.length === 0 ? (
    <div className="py-8 text-center text-gray-500">
      {t.listingDetail.photo.noPhotos}
    </div>
  ) : (
    <section className="mx-auto max-w-full py-8 lg:max-w-4xl">
      <div className="col-span-2">
        {spaces.length === 1 ? (
          <SpaceSection
            key={spaces[0].id}
            space={spaces[0]}
            spacing={spacing}
            onPhotoClick={(index, slides) => setLightboxData({ index, slides })}
            isUniqueSpace={true}
          />
        ) : (
          spaces.map((space) => (
            <div
              key={space.name}
              ref={(el) => {
                spaceRefs.current[space.name] = el;
              }}
            >
              {space.photos.length !== 0 && (
                <SpaceSection
                  key={space.id}
                  space={space}
                  spacing={spacing}
                  onPhotoClick={(index, slides) =>
                    setLightboxData({ index, slides })
                  }
                />
              )}
            </div>
          ))
        )}
        {lightboxData && (
          <Lightbox
            open={lightboxData.index >= 0}
            index={lightboxData.index}
            slides={lightboxData.slides}
            styles={lightboxStyles}
            plugins={[Counter, Zoom]}
            counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
            close={() => setLightboxData(null)}
            aria-label="Photo gallery lightbox"
            render={{
              slideFooter: ({ slide }) => (
                <div
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded px-4 py-2 text-sm text-white"
                  aria-label={slide.alt}
                >
                  {slide.alt}
                </div>
              ),
            }}
          />
        )}
      </div>
    </section>
  );
};

export default ListingGallery;
