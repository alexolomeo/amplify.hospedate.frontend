import StarRating from '@/components/React/Common/StarRating';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { Photo } from '@/types/listing/space';
import AvatarDisplay from '../Common/AvatarDisplay';
import type { ChangeEvent } from 'react';

interface Props {
  username: string;
  profilePicture?: Photo | null;
  lang?: SupportedLanguages;
  rating?: number | null;
  message: string;
  setMessage: (value: string) => void;
}

export default function SectionMessageHost({
  username,
  profilePicture = null,
  lang = 'en',
  rating,
  message,
  setMessage,
}: Props) {
  const t = getTranslation(lang);
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const prompt = t.booking.details.messageDescription.replace(
    '{name}',
    username
  );
  const placeholder = t.booking.details.messagePlaceholder.replace(
    '{name}',
    username
  );

  return (
    <section className="space-y-5 rounded-xl">
      <h2 className="text-2xl font-normal">{t.booking.details.message}</h2>
      <p className="max-w-xl text-sm">{prompt}</p>
      <div className="flex items-center gap-4">
        <AvatarDisplay
          profilePicture={profilePicture}
          username={username}
          size="h-14 w-14"
          sizeText="text-lg"
        />
        <div>
          <p className="font-semibold">{username}</p>
          {rating && (
            <div className="flex gap-0.5">
              <StarRating rating={rating} size="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      <textarea
        className="placeholder-neutral w-full resize-none rounded-lg border border-gray-300 p-4 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
        rows={3}
        placeholder={placeholder}
        value={message}
        onChange={handleChange}
      />
    </section>
  );
}
