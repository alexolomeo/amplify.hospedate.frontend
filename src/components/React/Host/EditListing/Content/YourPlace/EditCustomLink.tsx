import { useState } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';

interface Props {
  lang?: SupportedLanguages;
  initialTitle?: string;
  onChange?: (value: string) => void;
}
export default function EditCustomLink({
  lang = 'es',
  initialTitle = '',
  onChange,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();

  const [link, setLink] = useState(initialTitle);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLink(newValue);
    onChange?.(newValue);
  };
  return (
    <div>
      <div className="pb-30">
        <div className="space-y-8">
          <h2 className="w-full text-lg leading-7 font-bold">
            {t.hostContent.editListing.content.customLink.title}
          </h2>
          <input
            type="url"
            value={link}
            onChange={handleChange}
            placeholder={
              t.hostContent.editListing.content.customLink.placeholder
            }
            className="input input-lg focus:border-primary h-16 min-h-16 w-full rounded-full leading-6 focus:ring-0 focus:outline-none"
            disabled={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
}
