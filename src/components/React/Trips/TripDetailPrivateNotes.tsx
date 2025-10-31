import React, { useState, useRef } from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { TripDetail } from '@/types/tripDetail';

interface TripDetailPrivateNotesProps {
  tripDetail: TripDetail;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
  onSave?: (content: string) => void;
}

const TripDetailPrivateNotes: React.FC<TripDetailPrivateNotesProps> = ({
  t,
  onSave,
}) => {
  const title = translate(t, 'trips.privateNotes');
  const description = translate(t, 'trips.privateNotesDescription');
  const initialContent = ''; // This could come from tripDetail if needed
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleBlur = () => {
    if (onSave && content !== initialContent) {
      onSave(content);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base-content text-lg font-bold sm:text-xl">
          {title}
        </h3>
      </div>
      <p className="text-neutral m-0 text-sm">{description}</p>
      <div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={translate(t, 'trips.privateNotesPlaceholder')}
          className="resize-vertical min-h-[120px] w-full rounded-lg border border-[var(--color-neutral-content)] bg-[var(--color-base-100)] p-3 text-[var(--color-base-content)] placeholder:text-[var(--color-placeholder)] focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default TripDetailPrivateNotes;
