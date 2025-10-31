import React from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import Minuscircle from '/src/icons/minuscircle.svg?react';
import Chevron from '/src/icons/chevron-right.svg?react';
import { AppModal } from './AppModal';
import AppIcon from '../../Common/AppIcon';
import type { Language } from '@/types/user';

export interface ExperienceItem {
  key: string;
  text: string;
  value: string | number[] | boolean;
}

interface ExperiencesModalProps {
  lang?: SupportedLanguages;
  isOpen: boolean;
  answeredExperiences: ExperienceItem[];
  pendingExperiences: ExperienceItem[];
  onClose: () => void;
  cancel: () => void;
  onEditExperience: (key: string) => void;
  onRemoveExperience: (key: string) => void;
  onSave: () => void;
  languageOptions?: Language[];
}

function toLowerCamelCase(str: string) {
  return str
    .toLowerCase()
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function formatExperienceValue(
  exp: ExperienceItem,
  languageOptions: Language[] | undefined
): string {
  if (Array.isArray(exp.value)) {
    if (!languageOptions || languageOptions.length === 0) {
      return exp.value.join(', ');
    }
    const labels = exp.value
      .map((id) => languageOptions.find((l) => l.id === id)?.name || String(id))
      .filter(Boolean);
    return labels.join(', ');
  }
  if (typeof exp.value === 'boolean') {
    return '';
  }
  return exp.value;
}

const ExperiencesModal: React.FC<ExperiencesModalProps> = ({
  isOpen,
  answeredExperiences,
  pendingExperiences,
  onClose,
  onEditExperience,
  onRemoveExperience,
  onSave,
  lang = 'es',
  languageOptions = [],
  cancel,
}) => {
  const t = getTranslation(lang);
  return (
    <AppModal
      id="experiences-modal"
      title={t.profile.aboutYourExperienceTitle}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-base font-semibold text-neutral-600 underline-offset-2 hover:underline"
            onClick={cancel}
          >
            {t?.profile?.cancel}
          </button>
          <button
            type="button"
            className="btn btn-primary rounded-full"
            onClick={onSave}
          >
            {t?.profile?.save}
          </button>
        </div>
      }
    >
      <div className="flex max-h-[72vh] flex-col bg-[var(--color-primary-content)]">
        <div className="no-scrollbar flex-1 overflow-y-auto pr-1">
          <p className="text-neutral mb-5 text-sm">{t?.profile?.addSpecify}</p>

          {/* Respondidas */}
          <section className="mb-6">
            <h3 className="mb-3 text-base font-semibold">
              {t?.profile?.answered}
            </h3>
            <ul className="space-y-1">
              {answeredExperiences.map((exp) => {
                const iconName = exp.key.replace(/_/g, '-').toLowerCase();
                const labelKey = toLowerCamelCase(
                  exp.key
                ) as keyof typeof t.listingDetail.host.info;
                const valueText = formatExperienceValue(exp, languageOptions);
                const hideRemove = exp.key === 'show_birth_decade';
                return (
                  <li
                    key={exp.key}
                    className="hover:bg-base-100 flex items-center justify-between rounded-xl px-3 py-3 transition"
                  >
                    <div
                      className="flex min-w-0 cursor-pointer items-center gap-3"
                      onClick={() => onEditExperience(exp.key)}
                    >
                      <AppIcon
                        iconName={iconName}
                        folder="about-user"
                        className="text-secondary h-5 w-5"
                        loaderCompact
                      />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[15px]">
                          {t.listingDetail.host.info[labelKey]}:
                        </span>
                        <span className="text-sm text-neutral-500">
                          {valueText}
                        </span>
                      </div>
                    </div>
                    {!hideRemove && (
                      <button
                        type="button"
                        className="inline-flex cursor-pointer items-center justify-center p-1.5 text-rose-400 transition hover:text-rose-500"
                        onClick={() => onRemoveExperience(exp.key)}
                        title={t?.profile?.delete}
                        aria-label={t?.profile?.delete}
                      >
                        <Minuscircle className="h-5 w-5" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Pendientes */}
          <section>
            <h3 className="mb-3 text-base font-semibold text-neutral-800">
              {t?.profile?.reply}
            </h3>
            <ul className="space-y-1">
              {pendingExperiences.map((exp) => {
                const iconName = exp.key.replace(/_/g, '-').toLowerCase();
                const labelKey = toLowerCamelCase(
                  exp.key
                ) as keyof typeof t.listingDetail.host.info;

                return (
                  <li
                    key={exp.key}
                    onClick={() => onEditExperience(exp.key)}
                    className="group hover:bg-base-100 flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 transition"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <AppIcon
                        iconName={iconName}
                        folder="about-user"
                        className="text-secondary h-5 w-5"
                        loaderCompact
                      />
                      <span className="truncate text-[15px]">
                        {t.listingDetail.host.info[labelKey]}:
                      </span>
                    </div>
                    <Chevron className="h-5 w-5" />
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </AppModal>
  );
};

export default ExperiencesModal;
