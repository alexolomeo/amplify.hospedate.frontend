import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import React, { useState } from 'react';
import AppButton from '../../Host/PreviewListing/common/AppButton';
import ExperiencesModal from './ExperiencesModal';
import ExperienceEditModal from './ExperienceEditModal';
import type { User } from '@/types/user';
import type { UserInfoValues } from '@/services/users-profile';

export interface EditExperienceProps {
  lang?: SupportedLanguages;
  userProfile: User;
  onSaveExperiences: (payload: UserInfoValues) => void;
  payload: UserInfoValues;
}
interface ExperienceItem {
  key: string;
  text: string;
  value: string | number[] | boolean;
}

const EXCLUDE_KEYS = new Set(['about']);

function parseLangToArray(v: unknown): number[] {
  if (Array.isArray(v)) return v.map(Number).filter((n) => !Number.isNaN(n));
  if (typeof v === 'string' && v.trim())
    return v
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n));
  return [];
}
const EditExperience: React.FC<EditExperienceProps> = ({
  lang = 'es',
  userProfile,
  onSaveExperiences,
  payload,
}) => {
  const t = getTranslation(lang);
  const [payloadLocal, setPayloadLocal] = useState<UserInfoValues>(payload);
  const [openExperiencesModal, setOpenExperiencesModal] = useState(false);
  const [openEditExperienceModal, setOpenEditExperienceModal] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState<string | null>(null);

  const onEditExperience = (key: string) => {
    setExperienceToEdit(key);
    setOpenEditExperienceModal(true);
    setOpenExperiencesModal(false);
  };

  const onRemoveExperience = (key: string) => {
    if (key === 'languages') {
      setPayloadLocal((prev) => ({ ...prev, languages: [] }));
      return;
    }
    if (key === 'show_birth_decade') {
      setPayloadLocal((prev) => ({ ...prev, show_birth_decade: false }));
      return;
    }
    setPayloadLocal((prev) => ({ ...prev, [key]: '' }));
  };

  const onSaveExperience = (exp: ExperienceItem) => {
    setPayloadLocal((prev) => {
      return { ...prev, [exp.key]: exp.value };
    });

    setOpenEditExperienceModal(false);
  };
  const onSave = async () => {
    onSaveExperiences(payloadLocal);
    setOpenExperiencesModal(false);
  };

  const cancel = async () => {
    setPayloadLocal(payload);
    setOpenExperiencesModal(false);
  };

  const experiences = Object.entries(payloadLocal)
    .filter(([key]) => !EXCLUDE_KEYS.has(key))
    .map(([key, value]) => ({
      key,
      text: key,
      value:
        key === 'languages'
          ? Array.isArray(value)
            ? (value as number[])
            : parseLangToArray(value)
          : key === 'show_birth_decade'
            ? Boolean(value)
            : String(value ?? ''),
    }));

  const experienceKey =
    Object.keys(payloadLocal)
      .filter((k) => !EXCLUDE_KEYS.has(k))
      .find((k) => k === experienceToEdit) || null;

  const experience = !experienceKey
    ? null
    : {
        key: experienceKey,
        text: experienceKey,
        value:
          experienceKey === 'languages'
            ? (payloadLocal.languages ?? [])
            : experienceKey === 'show_birth_decade'
              ? Boolean(payloadLocal.show_birth_decade)
              : String(
                  payloadLocal[experienceKey as keyof UserInfoValues] ?? ''
                ),
      };

  const isAnswered = (exp: ExperienceItem) =>
    Array.isArray(exp.value)
      ? exp.value.length > 0
      : typeof exp.value === 'string'
        ? exp.value.trim() !== ''
        : typeof exp.value === 'boolean'
          ? true
          : false;
  return (
    <div>
      <AppButton
        type="button"
        label={t.profile.label}
        className="btn btn-secondary btn-outline rounded-full"
        onClick={() => setOpenExperiencesModal(true)}
      />

      <ExperiencesModal
        isOpen={openExperiencesModal}
        answeredExperiences={experiences.filter(isAnswered)}
        pendingExperiences={experiences.filter((e) => !isAnswered(e))}
        onClose={() => setOpenExperiencesModal(false)}
        onEditExperience={onEditExperience}
        onRemoveExperience={onRemoveExperience}
        onSave={onSave}
        cancel={cancel}
        lang={lang}
        languageOptions={userProfile.info?.languages}
      />

      <ExperienceEditModal
        experience={experience}
        isOpen={openEditExperienceModal}
        onClose={() => {
          setOpenEditExperienceModal(false);
          setOpenExperiencesModal(true);
        }}
        onSave={onSaveExperience}
        lang={lang}
        languageOptions={userProfile.info?.languages}
      />
    </div>
  );
};

export default EditExperience;
