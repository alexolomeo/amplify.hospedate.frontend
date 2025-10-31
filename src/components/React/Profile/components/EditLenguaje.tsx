import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import React, { useMemo, useState, useCallback } from 'react';
type Idioma = { id: number; name: string; disabled?: boolean };
export interface EditLenguajeProps {
  options: ReadonlyArray<Idioma>;
  value: number[];
  onChange: (next: number[]) => void;
  placeholderBuscar?: string;
  className?: string;
  maxAltoPx?: number;
  disabled?: boolean;
  lang?: SupportedLanguages;
}

function normalizar(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').trim();
}

const EditLenguaje: React.FC<EditLenguajeProps> = ({
  options,
  value,
  onChange,
  placeholderBuscar = '',
  className = 'w-full',
  disabled = false,
  lang = 'es',
}) => {
  const [q, setQ] = useState('');
  const t = getTranslation(lang);
  const filtered = useMemo(() => {
    const term = normalizar(q);
    if (!term) return options;
    return options.filter((o) => normalizar(o.name).includes(term));
  }, [q, options]);

  const toggle = useCallback(
    (id: number) => {
      if (disabled) return;
      onChange(
        value.includes(id) ? value.filter((x) => x !== id) : [...value, id]
      );
    },
    [disabled, onChange, value]
  );

  return (
    <div className={className} role="group" aria-label="Selecciona idiomas">
      <label htmlFor="buscar-idioma" className="sr-only">
        {t.search.search}
      </label>
      <input
        id="buscar-idioma"
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholderBuscar}
        className="mb-3 w-full rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#2E6BE6]"
        disabled={disabled}
      />
      <div className="max-h-56 overflow-y-scroll rounded-2xl">
        {filtered.length === 0 && (
          <div className="px-4 py-3 text-sm text-neutral-500">
            {t.search.noResultsFound}
          </div>
        )}
        <ul className="py-1">
          {filtered.map((opt) => {
            const checked = value.includes(opt.id);
            const isDisabled = !!opt.disabled || disabled;

            return (
              <li key={opt.id}>
                <label
                  className={`hover:bg-base-200 flex cursor-pointer items-center gap-3 px-4 py-2 text-sm select-none ${
                    checked ? 'bg-base-200 font-semibold' : ''
                  } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <input
                    type="checkbox"
                    className="border-primary h-4 w-4 rounded"
                    checked={checked}
                    onChange={() => toggle(opt.id)}
                    disabled={isDisabled}
                  />
                  <span className="truncate">
                    {translate(t, `languages.${opt.name}`)}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default EditLenguaje;
