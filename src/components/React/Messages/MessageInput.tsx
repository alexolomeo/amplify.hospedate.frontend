import type { ChangeEvent, FormEvent } from 'react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import PhotoIcon from 'src/icons/photo.svg?react';
import PaperAirplaneIcon from 'src/icons/paper-airplane.svg?react';
import { useIsMobile } from '@/components/React/Hooks/useIsMobile';

interface MessageInputProps {
  conversationId: number;
  lang?: SupportedLanguages;
  onSend: (msg: {
    type: 'text' | 'image';
    content: string | File;
  }) => Promise<void>;
}

const MAX_IMAGES = 30 as const;
const MAX_CHARS = 4000 as const;
const CHAR_COUNTER_WARNING_THRESHOLD = 3900 as const;
const MIN_IMG_W = 1024 as const;
const MIN_IMG_H = 768 as const;
const MAX_IMG_W = 5000 as const;
const MAX_IMG_H = 5000 as const;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const;
type AllowedMime = (typeof ALLOWED_MIME)[number];
const ALLOWED_MIME_STRINGS: readonly string[] = ALLOWED_MIME;

/** Type guard to narrow a string to AllowedMime */
function isAllowedMime(mime: string): mime is AllowedMime {
  return ALLOWED_MIME_STRINGS.includes(mime);
}

/** Load image dimensions; uses createImageBitmap when available */
async function readImageSize(
  file: File
): Promise<{ width: number; height: number }> {
  if (
    'createImageBitmap' in window &&
    typeof createImageBitmap === 'function'
  ) {
    const bmp = await createImageBitmap(file);
    try {
      return { width: bmp.width, height: bmp.height };
    } finally {
      bmp.close();
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const img = new Image();
        img.onload = () =>
          resolve({
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
          });
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
      }
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Validate a single image file against MIME and dimension rules */
async function validateImageFile(
  file: File,
  t: ReturnType<typeof getTranslation>,
  allowedLabel: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const mime = (file.type || '').toLowerCase();
  if (!isAllowedMime(mime)) {
    const reason = t.messages.invalidImageFormat.replace(
      '{allowed}',
      allowedLabel
    );
    return { ok: false, reason };
  }

  try {
    const { width, height } = await readImageSize(file);

    if (width < MIN_IMG_W || height < MIN_IMG_H) {
      const reason = t.messages.imageTooSmall
        .replace('{minW}', String(MIN_IMG_W))
        .replace('{minH}', String(MIN_IMG_H));
      return { ok: false, reason };
    }

    if (width > MAX_IMG_W || height > MAX_IMG_H) {
      const reason = t.messages.imageTooLarge
        .replace('{maxW}', String(MAX_IMG_W))
        .replace('{maxH}', String(MAX_IMG_H));
      return { ok: false, reason };
    }

    return { ok: true };
  } catch {
    return { ok: false, reason: t.messages.imageValidationError };
  }
}

function clearImageValidationErrors(
  errors: string[],
  removeError: (msg: string) => void,
  t: ReturnType<typeof getTranslation>,
  allowedLabel: string
) {
  const candidates = [
    t.messages.invalidImageFormat.replace('{allowed}', allowedLabel),
    t.messages.imageTooSmall
      .replace('{minW}', String(MIN_IMG_W))
      .replace('{minH}', String(MIN_IMG_H)),
    t.messages.imageTooLarge
      .replace('{maxW}', String(MAX_IMG_W))
      .replace('{maxH}', String(MAX_IMG_H)),
    t.messages.imageValidationError,
  ];

  errors.forEach((err) => {
    if (candidates.includes(err)) {
      removeError(err);
    }
  });
}

export default function MessageInput({
  conversationId,
  lang = 'es',
  onSend,
}: MessageInputProps) {
  const t = getTranslation(lang);
  const allowedLabel = useMemo(() => {
    const conj = lang === 'en' ? ' or ' : ' o ';
    return ALLOWED_MIME_STRINGS.map((m) => m.split('/')[1].toUpperCase()).join(
      conj
    );
  }, [lang]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const isMobile = useIsMobile();

  const maxImagesErrorMsg = useMemo(
    () => t.messages.maxImagesError.replace('{maxImages}', String(MAX_IMAGES)),
    [t.messages.maxImagesError]
  );
  const maxCharsErrorMsg = t.messages.maxCharsError;

  const addError = useCallback((msg: string) => {
    setErrors((prev) => (prev.includes(msg) ? prev : [...prev, msg]));
  }, []);
  const removeError = useCallback((msg: string) => {
    setErrors((prev) => prev.filter((err) => err !== msg));
  }, []);

  const autoResize = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      if (val.length <= MAX_CHARS) {
        removeError(maxCharsErrorMsg);
      } else {
        addError(maxCharsErrorMsg);
      }
      setMessage(val);
      autoResize();
    },
    [addError, removeError, maxCharsErrorMsg, autoResize]
  );

  const remainingSlots = useMemo(
    () => Math.max(0, MAX_IMAGES - images.length),
    [images.length]
  );

  const handleImageChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length === 0) return;

      try {
        let incoming = files;
        if (files.length > remainingSlots) {
          incoming = files.slice(0, remainingSlots);
          const droppedCount = files.length - incoming.length;
          if (droppedCount > 0) addError(maxImagesErrorMsg);
        } else {
          removeError(maxImagesErrorMsg);
        }

        const accepted: File[] = [];
        const reasons = new Set<string>();

        for (const f of incoming) {
          const mime = (f.type || '').toLowerCase();
          if (!isAllowedMime(mime)) {
            reasons.add(
              t.messages.invalidImageFormat.replace('{allowed}', allowedLabel)
            );
            continue;
          }

          const res = await validateImageFile(f, t, allowedLabel);
          if (res.ok) {
            accepted.push(f);
          } else {
            reasons.add(res.reason);
          }
        }

        if (accepted.length > 0) {
          setImages((prev) => [...prev, ...accepted]);
          clearImageValidationErrors(errors, removeError, t, allowedLabel);
        }

        if (reasons.size > 0) {
          for (const r of reasons) addError(r);
        }
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [remainingSlots, addError, removeError, maxImagesErrorMsg, t, errors]
  );

  const removeImage = useCallback(
    (idx: number) => {
      setImages((prev) => {
        const next = prev.filter((_, i) => i !== idx);
        if (next.length <= MAX_IMAGES) removeError(maxImagesErrorMsg);
        return next;
      });
    },
    [maxImagesErrorMsg, removeError]
  );

  const handleSend = useCallback(
    async (e: FormEvent) => {
      setMessage('');
      e.preventDefault();
      const trimmed = message.trim();
      if ((trimmed.length === 0 && images.length === 0) || !onSend) return;

      if (trimmed.length > 0) {
        await onSend({ type: 'text', content: trimmed });
      }
      for (const img of images) {
        // Sequential sends preserve order
        await onSend({ type: 'image', content: img });
      }
      setImages([]);
      setErrors([]);
      const textarea = textareaRef.current;
      if (textarea) textarea.style.height = 'auto';
    },
    [message, images, onSend]
  );

  const isDisabled = useMemo(
    () =>
      message.length > MAX_CHARS ||
      (message.trim().length === 0 && images.length === 0),
    [message, images.length]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // On mobile, keep default behavior: Enter inserts a newline
      if (isMobile) return;

      // Desktop: Enter (without modifiers) sends
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();

        const hasText = message.trim().length > 0;
        const hasImages = images.length > 0;

        // Allow sending if there's text OR at least one image
        if (!isDisabled && (hasText || hasImages)) {
          void handleSend(e as unknown as FormEvent);
        }
      }
    },
    // Include images.length since we check it inside
    [isMobile, isDisabled, message, images.length, handleSend]
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isDisabled) {
        void handleSend(e);
      }
    },
    [isDisabled, handleSend]
  );

  useEffect(() => {
    if (!errors.includes(maxImagesErrorMsg)) return;
    const timer = setTimeout(() => {
      removeError(maxImagesErrorMsg);
    }, 5000);
    return () => clearTimeout(timer);
  }, [errors, maxImagesErrorMsg, removeError]);

  // Generate object URLs for previews and clean them up on change/unmount
  const previewUrls = useMemo(() => {
    return images.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
  }, [images]);
  useEffect(() => {
    return () => {
      previewUrls.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="sticky bottom-0 z-10 px-0 md:px-10">
      {/*TODO: enable when released*/}
      {/*<div className="pt-2 text-center text-xs text-neutral-400 md:mt-auto">*/}
      {/*  <span>*/}
      {/*    <svg*/}
      {/*      className="mr-1 inline-block h-4 w-4 align-middle"*/}
      {/*      fill="none"*/}
      {/*      stroke="currentColor"*/}
      {/*      strokeWidth={2}*/}
      {/*      viewBox="0 0 24 24"*/}
      {/*    >*/}
      {/*      <circle cx={12} cy={12} r={10} />*/}
      {/*      <path d="M12 6v6l4 2" />*/}
      {/*    </svg>*/}
      {/*    {translate(t, 'messages.averageResponseTime', { hours: 4 })}*/}
      {/*  </span>*/}
      {/*</div>*/}
      <div className="block px-4 md:px-0">
        {/* Error messages and counter*/}
        <div className="flex items-center justify-between pb-1">
          {/* Error messages */}
          <ul className="text-error mb-0 list-disc pl-5 text-xs">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>

          {message.length >= CHAR_COUNTER_WARNING_THRESHOLD && (
            <div
              className={`ml-auto text-xs select-none ${
                message.length > MAX_CHARS
                  ? 'text-error'
                  : 'text-base-content/60'
              }`}
              aria-live="polite"
            >
              {message.length} / {MAX_CHARS}
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className={`w-full ${errors.length ? 'pb-3' : 'py-3'}`}>
            <div className="scrollbar-thin flex max-w-full gap-2 overflow-x-auto">
              {previewUrls.map(({ url }, idx) => (
                <div key={idx} className="relative flex-shrink-0">
                  <img
                    src={url}
                    alt={t.messages.imagePreviewAlt}
                    className="h-16 w-16 rounded border border-neutral-200 object-cover"
                    draggable={false}
                  />
                  <button
                    type="button"
                    className="bg-neutral absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-xs text-white opacity-60 hover:opacity-100"
                    onClick={() => removeImage(idx)}
                    tabIndex={0}
                    aria-label={t.messages.removeImage}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <form
          className="flex w-full items-center gap-2 pb-5"
          onSubmit={handleFormSubmit}
        >
          {/* Image upload icon */}
          <button
            type="button"
            className="text-base-content flex h-9 w-9 cursor-pointer items-center justify-center transition-opacity hover:opacity-70"
            onClick={() => fileInputRef.current?.click()}
            aria-label={t.messages.attachImage}
            tabIndex={0}
          >
            <PhotoIcon className="h-5 w-5" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
              data-testid="image-upload-input"
            />
          </button>

          {/* Input container (expandable) */}
          <div className="hover:border-base-300 focus-within:border-base-300 active:border-base-300 relative flex flex-1 items-center rounded-2xl border border-neutral-200 px-4 py-2 md:min-h-12">
            <textarea
              ref={textareaRef}
              id={`${conversationId}-send-message`}
              placeholder={t.messages.inputMessagePlaceholder}
              className="placeholder-base-content max-h-[15vh] flex-1 resize-none overflow-y-auto border-none bg-transparent text-base outline-none placeholder:opacity-20"
              rows={1}
              value={message}
              onChange={handleInput}
              onInput={autoResize}
              onKeyDown={handleKeyDown}
              aria-label={t.messages.inputMessagePlaceholder}
            />
          </div>

          {/* Send button */}
          <button
            type="submit"
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              isDisabled
                ? 'bg-neutral opacity-60'
                : 'bg-primary hover:bg-secondary cursor-pointer'
            }`}
            disabled={isDisabled}
            aria-label={t.messages.sendMessage}
            tabIndex={0}
          >
            <PaperAirplaneIcon className="h-6 w-6 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
