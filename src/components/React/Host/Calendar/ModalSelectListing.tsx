import type { Listing } from '@/types/host/listing';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import Modal from '@/components/React/Common/Modal';
import { ResponsiveImage } from '../../Common/ResponsiveImage';
import { useEffect, useState, useMemo } from 'react';
import XMarkMini from '/src/icons/x-mark-mini.svg?react';
import { formatDateFull } from '@/utils/dateUtils';

interface Props {
  open: boolean;
  onClose: () => void;
  lang?: SupportedLanguages;
  selectedListing?: Listing;
  selectedListings?: Listing[];
  handleListingSelect?: (listing: Listing) => void;
  handleListingsSelect?: (listings: Listing[]) => void;
  listings: Listing[];
  multiple?: boolean;
}

export default function ModalSelectListing({
  open,
  onClose,
  lang = 'es',
  selectedListing,
  selectedListings,
  handleListingSelect,
  handleListingsSelect,
  listings,
  multiple = false,
}: Props) {
  const t = getTranslation(lang);

  const [selected, setSelected] = useState<Listing[]>([]);

  const fallbackPhoto = {
    original: '/images/host/listings/fallback-card-image.webp',
    srcsetWebp: '',
    srcsetAvif: '',
  };

  const visibleListings = useMemo(
    () =>
      listings.filter(
        (l) => l.status === 'PUBLISHED' || l.status === 'UNLISTED'
      ),
    [listings]
  );

  useEffect(() => {
    if (open) {
      if (multiple) {
        setSelected(selectedListings || []);
      } else {
        setSelected(selectedListing ? [selectedListing] : []);
      }
    }
  }, [open, selectedListing, selectedListings, multiple]);

  const handleToggle = (listing: Listing) => {
    if (multiple) {
      setSelected((prev) => {
        if (prev.some((l) => l.id === listing.id)) {
          return prev.filter((l) => l.id !== listing.id);
        } else {
          return [...prev, listing];
        }
      });
    } else {
      setSelected([listing]);
    }
  };

  const handleApply = () => {
    if (multiple) {
      if (handleListingsSelect) {
        handleListingsSelect(selected);
      }
    } else {
      if (handleListingSelect) {
        handleListingSelect(selected[0]);
      }
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      title={t.hostContent.calendar.selectListing}
      TitleSubtitleContentClass="flex-col items-start mt-4"
      titleClass="text-lg font-semibold"
      onClose={onClose}
      topLeftButton={false}
      topRightAction={
        <button
          onClick={onClose}
          className="mt-8 flex cursor-pointer items-center justify-center md:mr-10"
        >
          <XMarkMini className="h-5 w-5" />
        </button>
      }
      footer={
        <button
          onClick={handleApply}
          className="btn btn-primary rounded-full text-sm font-medium"
          disabled={selected.length === 0}
        >
          {t.hostContent.calendar.apply}
        </button>
      }
      lang={lang}
      widthClass="max-w-md"
    >
      <div className="flex max-h-1/2 w-full flex-col items-center gap-2 overflow-y-auto px-2">
        {visibleListings.length === 0 ? (
          <span className="text-base-content/70 text-sm">
            {t.today.noEvents}
          </span>
        ) : (
          visibleListings.map((listing) => (
            <div
              key={listing.id}
              className="flex w-full items-center justify-between gap-4"
            >
              <div className="flex w-full items-center gap-2">
                <ResponsiveImage
                  photo={listing.photo || fallbackPhoto}
                  alt={`listing-${listing.id}`}
                  className="h-10 w-10 rounded-2xl object-cover"
                />
                <span className="w-56 truncate text-sm font-medium">
                  {listing.title ?? formatDateFull(listing.createdAt)}
                </span>
              </div>
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={selected.some((l) => l.id === listing.id)}
                onChange={() => handleToggle(listing)}
              />
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
