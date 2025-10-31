import React, { useMemo, useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import { translate, type SupportedLanguages } from '@/utils/i18n';

import CloseIcon from '/src/icons/x-mark-mini.svg?react';
import CleaningIcon from '/src/icons/amenities/cleaning-products.svg?react';
import CheckBadgeIcon from '/src/icons/check-badge.svg?react';
import KeyIcon from '/src/icons/key.svg?react';
import ChatIcon from '/src/icons/chat-bubble.svg?react';
import MapPinIcon from '/src/icons/map-pin.svg?react';
import PriceIcon from '/src/icons/currency-dolar.svg?react';

interface RatingItem {
  key: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: number;
}

interface SharedReviewModalProps {
  open: boolean;
  onClose: () => void;
  hostName?: string;
  imageSrc?: string;
  initialRatings?: Partial<Record<string, number>>;
  onSubmit?: (payload: {
    text: string;
    ratings: Record<string, number>;
  }) => void;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
}

export default function SharedReviewModal({
  open,
  onClose,
  hostName = 'anfitrión',
  initialRatings,
  onSubmit,
  t,
  lang,
}: SharedReviewModalProps) {
  const [text, setText] = useState('');
  const [view, setView] = useState<'form' | 'success'>('form');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!open) {
      // delay resetting until the modal close animation finishes
      // so we don't swap content while it is animating (avoids flash)
      timer = setTimeout(() => {
        setText('');
        setView('form');
      }, 260);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [open]);

  // small css to hide native visuals but keep a transparent-sized thumb so dragging works
  const RANGE_STYLES = `
  .trip-review-range { -webkit-appearance: none; appearance: none; background: transparent; }
  /* keep an invisible but sized thumb so pointer events and dragging work */
  .trip-review-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: transparent; border: none; box-shadow: none; }
  .trip-review-range::-moz-range-thumb { width: 16px; height: 16px; background: transparent; border: none; }
  .trip-review-range::-ms-thumb { width: 16px; height: 16px; background: transparent; border: none; }
  `;

  const defaultRatings = useMemo(() => {
    const src = initialRatings ?? {};
    return {
      limpieza: src.limpieza ?? 4,
      exactitud: src.exactitud ?? 4,
      checkin: src.checkin ?? 5,
      comunicacion: src.comunicacion ?? 4,
      ubicacion: src.ubicacion ?? 4,
      precio: src.precio ?? 4,
    };
  }, [initialRatings]);

  const [ratings, setRatings] =
    useState<Record<string, number>>(defaultRatings);

  // Only sync default ratings when the modal opens (avoid resetting while user interacts)
  useEffect(() => {
    if (open) setRatings(defaultRatings);
  }, [defaultRatings, open]);

  function setRating(key: string, value: number) {
    setRatings((prev) => ({ ...prev, [key]: Math.max(0, Math.min(5, value)) }));
  }

  const items: RatingItem[] = [
    {
      key: 'limpieza',
      label: 'Limpieza',
      Icon: CleaningIcon,
      value: ratings.limpieza,
    },
    {
      key: 'exactitud',
      label: 'Exactitud',
      Icon: CheckBadgeIcon,
      value: ratings.exactitud,
    },
    {
      key: 'checkin',
      label: 'Check In',
      Icon: KeyIcon,
      value: ratings.checkin,
    },
    {
      key: 'comunicacion',
      label: 'Comunicación',
      Icon: ChatIcon,
      value: ratings.comunicacion,
    },
    {
      key: 'ubicacion',
      label: 'Ubicación',
      Icon: MapPinIcon,
      value: ratings.ubicacion,
    },
    { key: 'precio', label: 'Precio', Icon: PriceIcon, value: ratings.precio },
  ];

  function handleSubmit() {
    const payload = { text, ratings };
    onSubmit?.(payload);
    // switch to success view inside the same modal
    setView('success');
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
      title={translate(
        t,
        view === 'form'
          ? 'tripDetail.review.title'
          : 'tripDetail.review.success.title'
      )}
      lang={lang}
      showCancelButton={false}
      topLeftButton={false}
      TitleSubtitleContentClass="text-center flex max-w-[80%] flex-col items-center"
      titleClass="text-xl leading-7 font-semibold"
      widthClass="md:max-w-md"
      heightClass="md:max-h-lg"
    >
      <style>{RANGE_STYLES}</style>
      <div className="w-full">
        <CloseIcon
          className="absolute top-4 right-10 mt-1 h-6 w-6 cursor-pointer md:top-6 md:mt-0"
          onClick={() => {
            onClose();
          }}
        />

        {view === 'form' ? (
          <>
            <div className="frame-228 flex w-full flex-col items-center gap-2">
              <img
                src="/images/star-colored.webp"
                alt="Star"
                className="h-[80px] w-[87px] rounded-md object-cover"
              />
              <div className="text-center text-base">
                {translate(t, 'tripDetail.review.subtitle', { host: hostName })}
              </div>
            </div>

            <div className="content my-4 w-full">
              <div className="mb-2 text-xs font-semibold">
                {translate(t, 'tripDetail.review.talkAbout')}
              </div>
              <div className="text-input w-full">
                <div className="input-container bg-base-100 min-h-sm relative rounded-lg p-3">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={translate(t, 'tripDetail.review.placeholder')}
                    className="text-base-content w-full resize-none bg-transparent text-sm leading-5 outline-none placeholder:text-sm"
                  />
                  <div className="color-modifier-stroke border-base-content pointer-events-none absolute inset-0 rounded-lg border opacity-20" />
                </div>
              </div>
            </div>

            <div className="frame-227 flex w-full flex-col gap-6">
              {items.map((it) => {
                const pct = Math.max(0, Math.min(1, it.value / 5));
                return (
                  <div key={it.key} className="bar">
                    <div className="info mb-1.5 flex w-full items-center justify-between">
                      <div className="frame-226 flex w-[125px] items-center gap-2">
                        <it.Icon className="text-secondary h-4 w-4" />
                        <div className="text-xs">
                          {translate(t, `tripDetail.review.ratings.${it.key}`)}
                        </div>
                      </div>
                      <div className="text-base-content text-sm font-bold">
                        {ratings[it.key].toFixed(1)}
                      </div>
                    </div>

                    <div className="relative w-full">
                      <div className="progress-range bg-base-content pointer-events-none h-2 w-full rounded-full opacity-20" />

                      <input
                        type="range"
                        min={0}
                        max={5}
                        step={0.5}
                        value={ratings[it.key]}
                        onChange={(e) =>
                          setRating(it.key, Number(e.target.value))
                        }
                        className="trip-review-range absolute top-[-6px] left-0 z-10 h-6 w-full cursor-pointer appearance-none bg-transparent"
                      />

                      <div
                        className="progress-indicator bg-accent pointer-events-none absolute top-0 left-0 h-2 rounded-full"
                        style={{ width: `${pct * 100}%` }}
                      />
                      <div
                        className="ellipse-1 bg-accent pointer-events-none absolute top-[-6px] h-4 w-4 rounded-full"
                        style={{ left: `calc(${pct * 100}% - 8px)` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="buttons mt-6 flex w-full justify-end">
              <div className="button2">
                <button
                  onClick={handleSubmit}
                  className="button3 bg-primary text-primary-content flex h-10 cursor-pointer items-center justify-center rounded-full px-2 text-sm shadow-sm md:w-[285px]"
                >
                  {translate(t, 'tripDetail.review.registerButton')}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="frame-228 flex w-full flex-col items-center gap-2">
              <img
                src="/images/star-colored.webp"
                alt="Star"
                className="h-[120px] w-[120px] rounded-md object-cover sm:h-[159px] sm:w-[172px]"
              />
              <div className="text-center text-base">
                {translate(t, 'tripDetail.review.success.subtitle')}
              </div>
            </div>

            <div className="mt-6 flex w-full justify-end">
              <div className="m-auto w-full sm:w-[285px]">
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="bg-primary text-primary-content flex h-10 w-full cursor-pointer items-center justify-center rounded-full px-2 text-sm shadow-sm"
                >
                  {translate(t, 'tripDetail.review.success.closeButton')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
