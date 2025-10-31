import React, { useEffect, useState } from 'react';
import { AppModal } from './AppModal';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { Interest } from '@/types/user';

type InterestsCatalogDict = Record<string, string>;
type T = ReturnType<typeof getTranslation>;

interface Props {
  isOpen: boolean;
  selected: number[];
  onSave: (newInterests: number[]) => void;
  onClose: () => void;
  lang?: SupportedLanguages;
  catalog?: Interest[];
  saving?: boolean;
  error?: string | null;
}

const InterestsEditModal: React.FC<Props> = ({
  isOpen,
  selected,
  onSave,
  onClose,
  lang = 'es',
  catalog,
  saving = false,
  error = null,
}) => {
  const t: T = getTranslation(lang);

  const [options, setOptions] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] =
    useState<number[]>(selected);
  const [loading] = useState(false);

  useEffect(() => {
    setSelectedInterests(selected);
  }, [selected, isOpen]);

  useEffect(() => {
    let alive = true;

    const hydrate = async () => {
      if (catalog && catalog.length) {
        if (alive) setOptions(catalog);
        return;
      }

      const dict = (
        t.profile as T['profile'] & { interestsCatalog?: InterestsCatalogDict }
      ).interestsCatalog;

      if (dict) {
        const fromI18n: Interest[] = Object.entries(dict).map(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([key, label], index) => ({
            id: index + 1,
            name: label,
            icon: '',
            selected: false,
          })
        );
        if (alive) setOptions(fromI18n);
        return;
      }

      if (alive) setOptions([]);
    };

    if (isOpen) hydrate();
    return () => {
      alive = false;
    };
  }, [isOpen, catalog, t]);

  const toggleInterest = (id: number) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const canSave = true;

  return (
    <AppModal
      id="interests-modal"
      title={t.profile?.aboutYourInterests}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-neutral text-base font-semibold underline-offset-2 hover:underline"
            onClick={onClose}
          >
            {t?.profile?.cancel}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-md rounded-full"
            onClick={() => onSave(selectedInterests)}
            disabled={!canSave || saving}
          >
            {saving ? t.listings.loading : t?.profile?.save}
          </button>
        </div>
      }
    >
      <div className="flex max-h-[72vh] flex-col bg-[var(--color-primary-content)]">
        <div className="no-scrollbar flex-1 overflow-y-auto pr-1">
          <p className="mb-5 text-sm text-neutral-500">
            {t.profile?.selectInterestsDescription}
          </p>

          {loading ? (
            <div className="text-sm text-gray-500">{t.listings.loading}</div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {options.map((opt) => {
                const active = selectedInterests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={active}
                    className={[
                      'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition',
                      active
                        ? 'border-secondary bg-secondary text-secondary-content'
                        : 'text-secondary border-secondary',
                    ].join(' ')}
                    onClick={() => toggleInterest(opt.id)}
                  >
                    <span>{translate(t, `interests.${opt.name}`)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
        </div>
      </div>
    </AppModal>
  );
};

export default InterestsEditModal;
