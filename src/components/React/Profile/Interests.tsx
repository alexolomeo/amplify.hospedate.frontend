import React, { useMemo } from 'react';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { Interest } from '@/types/user';
import { getSafeArray } from '@/utils/displayHelpers';
import type { User } from '@/types/user';

interface Props {
  lang?: SupportedLanguages;
  user: User;
  isOwnProfile?: boolean;
  isModoEdit?: boolean;
}

const norm = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLowerCase();

const makeKey = (i: Interest) =>
  `${norm(i.name)}|${norm((i as Interest).icon ?? '')}`;

const Interests: React.FC<Props> = ({
  lang = 'es',
  user,
  isOwnProfile = false,
  isModoEdit = false,
}) => {
  const t = getTranslation(lang);
  const safeInterests = getSafeArray(user.interests, []);

  const uniqueInterests = useMemo(() => {
    const seen = new Set<string>();
    const out: Interest[] = [];
    for (const it of safeInterests) {
      if (!it) continue;
      const k = makeKey(it);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(it);
    }
    return out;
  }, [safeInterests]);

  const selectedInterests = uniqueInterests.filter(
    (interest) => interest.selected
  );

  return (
    <>
      {(selectedInterests.length > 0 || isModoEdit) && (
        <p className="text-xl leading-7 font-bold">
          {isOwnProfile
            ? t.profile.aboutYourInterests
            : translate(t, 'profile.interests', { username: user.username })}
        </p>
      )}

      {selectedInterests.length > 0 || !isModoEdit ? (
        <div className="flex flex-wrap gap-x-4 gap-y-3 pt-8">
          {selectedInterests.map((interest) => (
            <div
              key={makeKey(interest)}
              className="text-grey-700 flex items-center gap-2 rounded-full border border-[var(--color-neutral)] px-4 py-2 text-sm transition"
            >
              <p className="text-xs font-normal">
                {translate(t, `interests.${interest.name}`)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500">
            {isOwnProfile
              ? t.profile.interestsPlaceholder
              : t.profile.interestsEmpty}
          </p>
        </div>
      )}
    </>
  );
};

export default Interests;
