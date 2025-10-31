import Modal from '@/components/React/Common/Modal';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { ListingPhoto } from '@/types/listing/space';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import { useState } from 'react';
import SuccessModal from './SuccessModal';
import XMarkMini from '/src/icons/x-mark-mini.svg?react';

const photos: ListingPhoto[] = [
  {
    id: 75731390,
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
    id: 92533719,
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
  id: number;
  nameSpace: string;
  title?: string;
  description: string;
  showSkipForNow: boolean;
}

export default function AssignPhotosModal({
  open,
  onClose,
  lang = 'es',
  id,
  nameSpace,
  showSkipForNow,
  title,
  description,
}: UploadPhotosModalProps) {
  // TODO: call the service to fetch photos
  const t = getTranslation(lang);
  const [selectedPhoto, setSelectedPhoto] = useState<number[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);

  const handleUpload = async () => {
    if (id) {
      setAmount(selectedPhoto.length);
      // TODO: call the service to move the photos to a space

      closeModal();
      setIsSuccessModalOpen(true);
    }
  };
  const handlePhotosToggle = (id: number) => {
    setSelectedPhoto((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((photoId) => photoId !== id)
        : [...prevSelected, id]
    );
  };
  const closeModal = () => {
    setSelectedPhoto([]);
    onClose();
  };
  return (
    <>
      <Modal
        open={open}
        title={title ?? null}
        onClose={closeModal}
        heightClass="max-h-11/12"
        footer={
          <button
            className={`flex h-12 w-full max-w-[280px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-4 text-sm text-white shadow-sm transition-opacity disabled:opacity-50 md:max-w-none md:px-6 md:text-base`}
            disabled={selectedPhoto.length == 0}
            onClick={handleUpload}
          >
            {t.hostContent.editListing.content.gallery.save}
          </button>
        }
        subtitle={description}
        subtitleClass={'text-base leading-[14px] font-bold'}
        titleClass={'text-base leading-7 font-normal'}
        TitleSubtitleContentClass={'flex-col items-start mt-4'}
        lang={lang}
        topLeftButton={false}
        topRightAction={
          <button
            onClick={onClose}
            className="mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[16px]"
          >
            <XMarkMini className="h-5 w-5 flex-shrink-0" />
          </button>
        }
        showSkipForNow={showSkipForNow}
      >
        {photos.length === 0 ? (
          <div></div>
        ) : (
          <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3">
            {photos.map((item) => (
              <div
                className="inline-flex h-44 flex-col gap-1.5"
                key={item.id}
                onClick={() => handlePhotosToggle(item.id)}
              >
                {item.photo && (
                  <ResponsiveImage
                    photo={item.photo}
                    alt={'image selected'}
                    className={`relative h-36 w-full rounded-[30.40px] object-cover ${
                      selectedPhoto.includes(item.id)
                        ? 'border-primary border-[3px]' // Selected state
                        : 'border-[3px] border-transparent' // Unselected state
                    } `}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>
      <SuccessModal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        lang={lang}
        amount={amount}
        space={nameSpace}
      ></SuccessModal>
    </>
  );
}
