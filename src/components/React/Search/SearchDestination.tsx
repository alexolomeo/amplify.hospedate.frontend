import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePlaceAutocompleteSuggestions } from '../Hooks/usePlaceAutocompleteSuggestions';
import { useDebounce } from '../Hooks/useDebounce';
import { RecentSearch } from './RecentSearch';
import clsx from 'clsx';
import SearchIcon from '/src/icons/search.svg?react';

interface SearchDestinationProps {
  googleDescription: string;
  userInput: string;
  title: string;
  lang?: SupportedLanguages;
  onUpdate: (
    placeId: string | null,
    googleDescription: string,
    userInput: string
  ) => void;
  compactMode?: boolean;
  ismobile?: boolean;
}

const SearchDestination: React.FC<SearchDestinationProps> = ({
  googleDescription,
  userInput,
  title,
  lang = 'es',
  onUpdate,
  compactMode = false,
  ismobile = false,
}) => {
  const t = getTranslation(lang);
  const [localDestination, setLocalDestination] = useState(
    userInput || googleDescription
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const hasUserSelectedRef = useRef(false);
  const debouncedInput = useDebounce(localDestination, 300);
  const { suggestions, loading } =
    usePlaceAutocompleteSuggestions(debouncedInput);
  const containerRef = useRef<HTMLDivElement>(null);
  const isSearching =
    loading || (localDestination.trim() && debouncedInput !== localDestination);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownVisible(false);
        if (!hasUserSelectedRef.current && suggestions.length > 0) {
          const firstSuggestion = suggestions[0];
          onUpdate(
            firstSuggestion.placePrediction.placeId,
            firstSuggestion.description,
            localDestination
          );
        }
      }
    },
    [suggestions, localDestination, onUpdate]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handlePrediction = useCallback(
    async (
      prediction: google.maps.places.PlacePrediction,
      description: string
    ) => {
      hasUserSelectedRef.current = true;
      setLocalDestination(description);
      onUpdate(prediction.placeId, description, '');
      setDropdownVisible(false);
    },
    [onUpdate]
  );

  const handleBlur = useCallback(() => {
    if (
      localDestination.trim() &&
      !hasUserSelectedRef.current &&
      suggestions.length > 0 &&
      !loading
    ) {
      const firstSuggestion = suggestions[0];
      onUpdate(
        firstSuggestion.placePrediction.placeId,
        firstSuggestion.description,
        localDestination
      );
    }
    setDropdownVisible(false);
  }, [localDestination, suggestions, loading, onUpdate]);

  useEffect(() => {
    setLocalDestination(userInput || googleDescription);
    hasUserSelectedRef.current = false;
  }, [googleDescription, userInput]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalDestination(newValue);
      setDropdownVisible(true);
      hasUserSelectedRef.current = false;
      if (newValue.trim() === '') {
        onUpdate(null, '', '');
      }
    },
    [onUpdate]
  );
  return (
    <div className="dropdown py-auto h-full" ref={containerRef}>
      <div className="flex h-full items-center">
        <div tabIndex={0} role="button" className="w-full">
          {ismobile ? (
            <div className="flex w-full flex-col gap-2 px-1">
              <p className="text-lg font-bold">
                {t.search.destination.destination}
              </p>
              <label className="focus-within:ring-primary flex h-12 w-full items-center gap-2 rounded-2xl border border-gray-300 px-4 focus-within:ring-1">
                <SearchIcon className="h-4 w-4" />
                <input
                  type="text"
                  data-testid="destination-input"
                  value={localDestination}
                  placeholder={t.search.destination.exploreDestinations}
                  className="w-full text-sm outline-none placeholder:text-sm"
                  onChange={handleInputChange}
                  onFocus={() => setDropdownVisible(true)}
                  onBlur={handleBlur}
                />
              </label>
            </div>
          ) : (
            <>
              {!compactMode && <label className="search_label"> {title}</label>}
              {localDestination.trim() === '' && compactMode ? (
                <p className="truncate text-sm">
                  {t.search.destination.Anywhere}
                </p>
              ) : (
                <input
                  type="text"
                  data-testid="destination-input"
                  value={localDestination}
                  placeholder={t.search.destination.exploreDestinations}
                  className="search_input block max-w-36 truncate focus:outline-0"
                  onChange={handleInputChange}
                  onFocus={() => setDropdownVisible(true)}
                  onBlur={handleBlur}
                />
              )}
            </>
          )}
        </div>
      </div>
      {dropdownVisible && (
        <ul
          tabIndex={0}
          className={clsx(
            'dropdown-content menu rounded-box z-10 flex w-full bg-[var(--color-base-150)] p-2 shadow-xl lg:w-sm',
            ismobile ? 'mt-1' : 'mt-7'
          )}
          onMouseDown={(e) => e.preventDefault()}
        >
          {!localDestination ? (
            <RecentSearch></RecentSearch>
          ) : (
            <div className="w-full">
              <li className="text-neutral p-4 pb-2 text-xs">
                {isSearching ? t.search.searching : t.search.searchResults}
              </li>
              {isSearching ? (
                <li className="flex justify-center p-4">
                  <div className="loading loading-spinner loading-sm"></div>
                </li>
              ) : (
                <>
                  {suggestions.map((s) => (
                    <li
                      key={s.placePrediction.placeId}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      onClick={() =>
                        handlePrediction(s.placePrediction, s.description)
                      }
                    >
                      {s.description}
                    </li>
                  ))}
                  {suggestions.length === 0 && (
                    <li className="p-4">{t.search.noResultsFound}</li>
                  )}
                </>
              )}
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchDestination;
