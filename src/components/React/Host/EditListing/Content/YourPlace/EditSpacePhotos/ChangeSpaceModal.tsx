import Modal from '@/components/React/Common/Modal';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { SpaceType } from '@/types/listing/space';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import { useState } from 'react';

const spaceType: SpaceType[] = [
  {
    id: 6,
    name: 'Backyard',
    photo: {
      original:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.jpg',
      srcsetWebp:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1920w',
      srcsetAvif:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1920w',
    },
  },
  {
    id: 2,
    name: 'Art Studio',
    photo: {
      original:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.jpg',
      srcsetWebp:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1920w',
      srcsetAvif:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1920w',
    },
  },
  {
    id: 4,
    name: 'Darkroom',
    photo: {
      original:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.jpg',
      srcsetWebp:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1920w',
      srcsetAvif:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1920w',
    },
  },
  {
    id: 10,
    name: 'Deck',
    photo: {
      original:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.jpg',
      srcsetWebp:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1920w',
      srcsetAvif:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1920w',
    },
  },
  {
    id: 14,
    name: 'Front yard',
    photo: {
      original:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.jpg',
      srcsetWebp:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1920w',
      srcsetAvif:
        'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1920w',
    },
  },
];

interface UploadPhotosModalProps {
  open: boolean;
  onClose: () => void;
  lang?: SupportedLanguages;
  next: (space: SpaceType) => void;
}
export default function ChangeSpaceModal({
  open,
  onClose,
  lang = 'es',
  next,
}: UploadPhotosModalProps) {
  // TODO: call the service to fetch spaceType data
  const t = getTranslation(lang);
  const [selectedSpace, setSelectedSpace] = useState<SpaceType | null>(null);
  const handleUpload = async () => {
    if (selectedSpace) {
      next(selectedSpace);
      closeModal();
    }
  };
  const closeModal = () => {
    setSelectedSpace(null);
    onClose();
  };
  return (
    <Modal
      open={open}
      title={t.hostContent.editListing.content.gallery.selectRoom}
      onClose={closeModal}
      heightClass="max-h-11/12"
      titleClass="text-base leading-5 font-bold"
      footer={
        <button
          className={`btn btn-primary h-12 rounded-full px-4 text-sm font-normal md:px-6 md:text-base`}
          disabled={!selectedSpace}
          onClick={handleUpload}
        >
          {t.hostContent.editListing.content.gallery.next}
        </button>
      }
      lang={lang}
    >
      {spaceType.length == 0 ? (
        <div> </div>
      ) : (
        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3">
          {spaceType.map((item) => (
            <div
              className="inline-flex h-44 flex-col gap-1.5"
              key={item.id}
              onClick={() => setSelectedSpace(item)}
            >
              {item.photo && (
                <ResponsiveImage
                  photo={item.photo}
                  alt={item.name || 'space image'}
                  className={`relative h-36 w-full rounded-[30.40px] object-cover ${selectedSpace?.id === item.id ? 'border-primary border-[3px]' : 'border-[3px] border-transparent'}`}
                />
              )}
              <p className="text-sm font-normal">
                {translate(t, `spaceTypes.${item.name}`)}
              </p>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
