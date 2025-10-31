import { useState } from 'react';
import ChevronLeftIcon from '/src/icons/chevron-left-mini.svg?react';
import PlusIcon from '/src/icons/plus.svg?react';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { GalleryNav } from '@/types/host/edit-listing/galleryNav';

type Photo = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt?: string;
};

const MOCK_PHOTOS: Photo[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1505693314120-0d443867891c',
    width: 1600,
    height: 1200,
    alt: 'Sala',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    width: 1600,
    height: 1200,
    alt: 'Comedor',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f',
    width: 1600,
    height: 1200,
    alt: 'Dormitorio',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
    width: 1600,
    height: 1067,
    alt: 'Estudio',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1501183638710-841dd1904471',
    width: 1600,
    height: 1067,
    alt: 'Sala 2',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
    width: 1600,
    height: 1200,
    alt: 'Cocina',
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1494526585095-c41746248156',
    width: 1600,
    height: 1067,
    alt: 'Baño',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6',
    width: 1600,
    height: 1067,
    alt: 'Living',
  },
];

function SelectablePhoto({
  photo,
  selected,
  onToggle,
}: {
  photo: Photo;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      role="checkbox"
      aria-checked={selected}
      aria-label={photo.alt || 'Foto'}
      className={[
        'relative aspect-[4/3] w-full overflow-hidden rounded-[24px] transition',
        selected
          ? 'ring-4 ring-[var(--color-primary)]'
          : 'ring-1 ring-black/10 hover:ring-2 hover:ring-black/20',
        'focus:ring-4 focus:ring-[var(--color-primary)] focus:outline-none',
      ].join(' ')}
    >
      <img
        src={photo.src}
        alt={photo.alt ?? ''}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      {photo.alt && (
        <span className="absolute bottom-3 left-3 rounded-full bg-[var(--color-base-150)]/90 px-3 py-1 text-sm font-medium text-[var(--color-base-content)] shadow-md backdrop-blur">
          {photo.alt}
        </span>
      )}
    </button>
  );
}

export default function EditAllPhotosGallery({
  lang = 'es',
  nav,
}: {
  lang?: SupportedLanguages;
  nav: GalleryNav;
}) {
  const t = getTranslation(lang);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-base-100)] text-[var(--color-base-content)]">
      <div className="flex flex-1 flex-col items-start px-4 sm:px-6 lg:px-12 xl:px-[120px]">
        <div className="flex w-full flex-1 flex-col items-start gap-8 pt-8">
          <div className="flex w-full items-start justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={nav.backFromAllPhotos}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                aria-label={translate(
                  t,
                  'hostContent.editListing.content.gallery.back'
                )}
                title={translate(
                  t,
                  'hostContent.editListing.content.gallery.back'
                )}
              >
                <ChevronLeftIcon className="h-[14px] w-[14px]" />
              </button>
              <h1 className="text-lg leading-7 font-bold sm:text-xl">
                {translate(
                  t,
                  'hostContent.editListing.content.gallery.allPhotos'
                )}
              </h1>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-[16px] border border-[var(--color-primary)] shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
              aria-label={translate(
                t,
                'hostContent.editListing.content.gallery.addPhotos'
              )}
              title={translate(
                t,
                'hostContent.editListing.content.gallery.addPhotos'
              )}
            >
              <PlusIcon className="text-primary h-[14px] w-[14px]" />
            </button>
          </div>
          <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MOCK_PHOTOS.map((p) => (
              <SelectablePhoto
                key={p.id}
                photo={p}
                selected={selectedIds.includes(p.id)}
                onToggle={() => toggle(p.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
