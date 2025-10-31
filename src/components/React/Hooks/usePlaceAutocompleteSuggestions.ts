import { useState, useEffect, useRef } from 'react';
import useLoadGoogleMaps from './useLoadGoogleMaps';

export type Suggestion = {
  description: string;
  placePrediction: google.maps.places.PlacePrediction;
};

interface AutocompleteSuggestionResponse {
  suggestions: Array<{ placePrediction: google.maps.places.PlacePrediction }>;
}

export function usePlaceAutocompleteSuggestions(input: string, enabled = true) {
  const isLoaded = useLoadGoogleMaps();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const tokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(
    null
  );

  useEffect(() => {
    if (!isLoaded || !enabled) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const trimmed = input.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const lib = await (
          window.google.maps as unknown as {
            importLibrary(name: 'places'): Promise<typeof google.maps.places>;
          }
        ).importLibrary('places');

        if (!isMounted) return;

        const { AutocompleteSuggestion, AutocompleteSessionToken } = lib;
        tokenRef.current ??= new AutocompleteSessionToken();

        setLoading(true);
        const response =
          (await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: trimmed,
            sessionToken: tokenRef.current,
            includedRegionCodes: ['BO'],
          })) as AutocompleteSuggestionResponse;

        if (!isMounted) return;

        setSuggestions(
          response.suggestions.map((s) => ({
            description:
              (s.placePrediction.mainText?.text ?? '') +
              (s.placePrediction.secondaryText
                ? ', ' + s.placePrediction.secondaryText
                : ''),
            placePrediction: s.placePrediction,
          }))
        );
      } catch (err) {
        console.error('[Hook] Error en autocomplete suggestions:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [input, isLoaded, enabled]);

  return { suggestions, loading };
}
