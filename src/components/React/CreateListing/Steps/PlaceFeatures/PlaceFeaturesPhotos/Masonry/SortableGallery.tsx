import clsx from 'clsx';
import {
  type ComponentProps,
  type ComponentType,
  type JSX,
  useRef,
  useState,
  useMemo,
  useEffect,
} from 'react';
import type {
  ColumnsPhotoAlbumProps,
  MasonryPhotoAlbumProps,
  Photo,
  RowsPhotoAlbumProps,
} from 'react-photo-album';
import 'react-photo-album/columns.css';
// Overlay size set to 227px to match the design specification for photo overlays in the gallery.
// This ensures consistent appearance and alignment with other UI elements.
const OVERLAY_SIZE = 227;

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import Sortable from '@/components/React/CreateListing/Steps/PlaceFeatures/PlaceFeaturesPhotos/Masonry/Sortable';
import Overlay from '@/components/React/CreateListing/Steps/PlaceFeatures/PlaceFeaturesPhotos/Masonry/Overlay';
import classes from '@/components/React/CreateListing/Steps/PlaceFeatures/PlaceFeaturesPhotos/Masonry/SortableGallery.module.css';

type SortablePhoto<TPhoto extends Photo> = TPhoto & {
  id: string;
};

type ActivePhoto<TPhoto extends Photo> = {
  photo: SortablePhoto<TPhoto>;
  width: number;
  height: number;
  padding?: string;
};

type GalleryProps<TPhoto extends Photo> = {
  rows: RowsPhotoAlbumProps<TPhoto>;
  columns: ColumnsPhotoAlbumProps<TPhoto>;
  masonry: MasonryPhotoAlbumProps<TPhoto>;
};

type SortableGalleryProps<
  TPhoto extends Photo,
  TGalleryType extends keyof GalleryProps<TPhoto>,
> = GalleryProps<TPhoto>[TGalleryType] & {
  gallery: ComponentType<GalleryProps<TPhoto>[TGalleryType]>;
  movePhoto: (oldIndex: number, newIndex: number) => void;
};

export default function SortableGallery<
  TPhoto extends Photo,
  TGalleryType extends keyof GalleryProps<TPhoto>,
>({
  gallery: Gallery,
  photos: photoSet,
  movePhoto,
  render,
  ...rest
}: SortableGalleryProps<TPhoto, TGalleryType>) {
  const ref = useRef<HTMLDivElement>(null);
  const [activePhoto, setActivePhoto] = useState<ActivePhoto<TPhoto>>();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 10 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const photos = useMemo(
    () =>
      photoSet.map((photo) => ({
        ...photo,
        id: photo.key ?? photo.src,
      })),
    [photoSet]
  );

  useEffect(() => {
    return () => {
      setActivePhoto(undefined);
    };
  }, [setActivePhoto]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    const photo = photos.find((item) => item.id === active.id);

    const image = ref.current?.querySelector(`img[src="${photo?.src}"]`);
    const padding = image?.parentElement
      ? getComputedStyle(image.parentElement).padding
      : undefined;
    const { width, height } = image?.getBoundingClientRect() || {};

    if (photo !== undefined && width !== undefined && height !== undefined) {
      setActivePhoto({ photo, width, height, padding });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      movePhoto(
        photos.findIndex((photo) => photo.id === active.id),
        photos.findIndex((photo) => photo.id === over.id)
      );
    }

    setActivePhoto(undefined);
  };

  const renderSortable = <
    T extends keyof Pick<JSX.IntrinsicElements, 'div' | 'button' | 'a'>,
  >(
    Component: T,
    index: number,
    photo: TPhoto,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: ComponentProps<any>
  ) => (
    <Sortable key={index} id={(photo as SortablePhoto<TPhoto>).id}>
      <Component {...props} />
    </Sortable>
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      collisionDetection={closestCenter}
    >
      <SortableContext items={photos}>
        <div className={classes.gallery}>
          <Gallery
            ref={ref}
            photos={photos}
            render={{
              ...render,
              link: (props, { index, photo }) =>
                renderSortable('a', index, photo, props),
              wrapper: (props, { index, photo }) =>
                renderSortable('div', index, photo, {
                  ...props,
                  className: clsx(
                    props.className,
                    'bg-transparent shadow-none !shadow-none'
                  ),
                  style: {
                    ...props.style,
                    boxShadow: 'none !important',
                  },
                }),

              button: (props, { index, photo }) =>
                renderSortable('button', index, photo, props),
            }}
            {...rest}
          />
        </div>
      </SortableContext>

      <DragOverlay adjustScale={false}>
        {activePhoto && (
          <div
            style={{
              width: OVERLAY_SIZE,
              height: OVERLAY_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Overlay
              photo={activePhoto.photo}
              width={OVERLAY_SIZE}
              height={OVERLAY_SIZE}
              padding={activePhoto.padding}
              className={clsx(
                classes.overlayImage,
                'object-cover object-center'
              )}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
