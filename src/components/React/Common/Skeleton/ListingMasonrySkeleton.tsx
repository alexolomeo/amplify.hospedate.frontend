import React from 'react';
import { ColumnsPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/columns.css';

type Photo = { src: string; width: number; height: number; alt?: string };

type Props = {
  photos?: Photo[];
  spacing?: number;
  columns?: number | ((w: number) => number);
  fallbackCount?: number;
};

const ListingMasonrySkeleton: React.FC<Props> = ({
  photos,
  spacing = 16,
  columns = (w) => (w < 600 ? 2 : 3),
  fallbackCount = 5,
}) => {
  const list: Photo[] =
    photos && photos.length
      ? photos
      : Array.from({ length: fallbackCount }, () => ({
          src: '',
          width: 4,
          height: 3,
        }));

  return (
    <section className="animate-pulse">
      <ColumnsPhotoAlbum
        photos={list}
        spacing={spacing}
        columns={columns}
        render={{
          image: (props) => (
            <div
              style={props.style}
              className={`${props.className} bg-base-300 rounded-[40px]`}
              aria-hidden
            />
          ),
        }}
      />
    </section>
  );
};

export default ListingMasonrySkeleton;
