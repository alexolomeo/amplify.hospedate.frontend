import React, { useEffect, useState } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { AppModal } from './AppModal';
import type { Language } from '@/types/user';
import EditLenguaje from './EditLenguaje';

export interface ExperienceItem {
  key: string;
  text: string;
  value: string | number[] | boolean;
}

interface ExperienceEditModalProps {
  experience: ExperienceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (experience: ExperienceItem) => void;
  lang?: SupportedLanguages;
  languageOptions?: Language[];
}

function parseLangToArray(v: unknown): number[] {
  if (Array.isArray(v))
    return v.map((n) => Number(n)).filter((n) => !Number.isNaN(n));
  if (typeof v === 'string' && v.trim()) {
    return v
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n));
  }
  return [];
}

const ExperienceEditModal: React.FC<ExperienceEditModalProps> = ({
  experience,
  isOpen,
  onClose,
  onSave,
  lang = 'es',
  languageOptions = [],
}) => {
  const t = getTranslation(lang);

  const [value, setValue] = useState<string | number[] | boolean | undefined>(
    undefined
  );

  useEffect(() => {
    if (!experience) return;
    const isLanguage = experience.key === 'languages';
    const isBirthDecade = experience.key === 'show_birth_decade';

    if (isLanguage) {
      setValue(parseLangToArray(experience.value));
    } else if (isBirthDecade) {
      setValue(Boolean(experience.value));
    } else {
      setValue(
        typeof experience.value === 'string'
          ? experience.value
          : String(experience.value ?? '')
      );
    }
  }, [experience]);

  if (!experience || value === undefined) return null;

  const isLanguage = experience.key === 'languages';
  const isBirthDecade = experience.key === 'show_birth_decade';

  const title = isLanguage
    ? t.profile.selectLanguagesTitle
    : isBirthDecade
      ? t.profile.aboutShowBirthDecade
      : t.profile.aboutYourExperienceTitle;

  const description = isLanguage
    ? t.profile.selectLanguagesDescription
    : isBirthDecade
      ? t.profile.addShowBirthDecade
      : t.profile.addInformationModal;

  return (
    <AppModal
      id="experience-edit-modal"
      title={title}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="rounded-3xl">
        <p className="text-neutral mt-4 mb-4 text-sm">{description}</p>

        <label htmlFor="experience-input" className="sr-only">
          {experience.text}
        </label>

        {isLanguage ? (
          <div className="h-72">
            <EditLenguaje
              options={languageOptions}
              value={Array.isArray(value) ? (value as number[]) : []}
              onChange={(arr) => setValue(arr)}
              placeholderBuscar={t.profile.selectLanguagesPlaceholder}
              maxAltoPx={300}
              lang={lang}
            />
          </div>
        ) : isBirthDecade ? (
          <div className="mt-2">
            <label className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3">
              <span className="text-[15px]">{t.profile.showBirthDecade}</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={Boolean(value)}
                onChange={(e) => setValue(e.target.checked)}
              />
            </label>
          </div>
        ) : (
          <textarea
            id="experience-input"
            maxLength={500}
            className="bg-base-100 focus:ring-primary w-full rounded-md border border-neutral-300 px-4 py-3 text-[15px] placeholder-neutral-400 shadow-sm outline-none focus:border-transparent focus:ring-2"
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t.profile.placeholderModal}
            autoFocus
          />
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            className="text-neutral text-base font-semibold hover:underline"
            type="button"
            onClick={onClose}
          >
            {t.profile.cancel}
          </button>

          <button
            className="btn btn-primary btn-md rounded-full"
            type="button"
            disabled={
              isLanguage
                ? !Array.isArray(value) || value.length === 0
                : isBirthDecade
                  ? false
                  : typeof value === 'string' && !value.trim()
            }
            onClick={() => {
              const finalValue = isLanguage
                ? value // number[]
                : isBirthDecade
                  ? Boolean(value) // boolean
                  : typeof value === 'string'
                    ? value.trim()
                    : '';

              onSave({ ...experience, value: finalValue });
            }}
          >
            {t.profile.save}
          </button>
        </div>
      </div>
    </AppModal>
  );
};

export default ExperienceEditModal;
