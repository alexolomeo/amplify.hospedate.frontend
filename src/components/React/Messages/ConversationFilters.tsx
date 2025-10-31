import { useState } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface Props {
  lang?: SupportedLanguages;
}

export default function ConversationFilters({ lang = 'es' }: Props) {
  const t = getTranslation(lang);
  const filters = [
    t.messages.filter.all,
    t.messages.filter.unread,
    t.messages.filter.favorites,
  ];
  const [filter, setFilter] = useState(filters[0]);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl leading-8 font-bold">{t.messages.title}</h2>
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="btn btn-ghost btn-sm border-secondary text-secondary rounded-full border px-3"
          >
            {filter}
            <svg
              className="stroke-secondary ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow"
          >
            {filters.map((opt) => (
              <li key={opt}>
                <button
                  className={`text-secondary rounded px-2 py-1 ${opt === filter ? 'bg-secondary/10' : ''}`}
                  onClick={() => setFilter(opt)}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder={t.messages.searchBar.title}
          className="bg-base-100 focus:border-secondary w-full rounded-xl border border-neutral-200 py-3 pr-12 pl-4 text-base font-normal transition placeholder:text-neutral-400 focus:outline-none"
        />
        <button className="hover:text-secondary absolute top-1/2 right-3 -translate-y-1/2 p-1 text-neutral-400">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
