import React, { useMemo } from 'react';
import type { User, Interest } from '@/types/user';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface Props {
  lang?: SupportedLanguages;
  user: User;
}

function normName(name: unknown): string {
  return String(name ?? '')
    .trim()
    .toLowerCase();
}

const InterestsChipList: React.FC<Props> = ({ lang = 'es', user }) => {
  const t = getTranslation(lang);

  const interestsUnique: Interest[] = useMemo(() => {
    const arr = Array.isArray(user?.interests) ? user.interests : [];
    const seen = new Set<string>();
    const out: Interest[] = [];
    for (const it of arr) {
      if (!it) continue;
      const k = normName((it as Interest).name);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(it as Interest);
    }
    return out;
  }, [user?.interests]);

  if (!interestsUnique.length) return null;

  return (
    <div className="space-y-3 py-3">
      <p className="text-xl leading-7 font-bold">
        {t.profile.aboutYourInterests}
      </p>
      <div className="flex flex-wrap gap-3">
        {interestsUnique.map((interest) => (
          <span
            key={normName(interest.name)}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--color-neutral)] bg-white px-4 py-1 text-base font-medium text-[var(--color-neutral)]"
          >
            {interest.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default InterestsChipList;
