import type { Coordinates, PlaceLocation } from '@/types/createListing';

type ComponentType =
  | 'street_number'
  | 'route'
  | 'street_address'
  | 'sublocality'
  | 'sublocality_level_1'
  | 'locality'
  | 'administrative_area_level_2'
  | 'administrative_area_level_1'
  | 'postal_town'
  | 'neighborhood'
  | 'country'
  | 'premise'
  | 'subpremise';

function getComponentLongName(
  components: google.maps.GeocoderAddressComponent[],
  type: ComponentType
) {
  return components.find((c) => c.types.includes(type))?.long_name || '';
}

function isLikelyPlusCode(text: string): boolean {
  if (!text) return false;
  const hasPlus = text.includes('+');
  const compact = text.replace(/\s|,/g, '');
  const looksCode = /^[2-9CFGHJMPQRVWX]+(\+)[2-9CFGHJMPQRVWX]+$/i.test(compact);
  return hasPlus && looksCode;
}

export default function useReverseGeocoding() {
  const reverseGeocode = async (
    coords: Coordinates
  ): Promise<PlaceLocation | null> => {
    return new Promise((resolve) => {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(coords.latitude, coords.longitude);

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status !== 'OK' || !results?.[0]) {
          resolve(null);
          return;
        }

        const r0 = results[0];
        const components = r0.address_components ?? [];

        const country = getComponentLongName(components, 'country') || '';
        const state =
          getComponentLongName(components, 'administrative_area_level_1') || '';
        const city =
          getComponentLongName(components, 'locality') ||
          getComponentLongName(components, 'administrative_area_level_2') ||
          getComponentLongName(components, 'postal_town') ||
          getComponentLongName(components, 'sublocality') ||
          getComponentLongName(components, 'sublocality_level_1') ||
          getComponentLongName(components, 'neighborhood') ||
          '';

        if (country && country !== 'Bolivia') {
          resolve(null);
          return;
        }

        const route =
          getComponentLongName(components, 'route') ||
          getComponentLongName(components, 'street_address');
        const streetNumber = getComponentLongName(components, 'street_number');
        const combinedStreet = [route, streetNumber]
          .filter(Boolean)
          .join(' ')
          .trim();

        const formatted = r0.formatted_address || '';
        const onlyFirstPart = formatted.split(',')[0]?.trim() || '';

        let address = combinedStreet || onlyFirstPart || '';

        if (isLikelyPlusCode(address)) {
          address = '';
        }

        const apt =
          getComponentLongName(components, 'subpremise') ||
          getComponentLongName(components, 'premise') ||
          undefined;

        const location: PlaceLocation = {
          address,
          city,
          state,
          country: country || 'Bolivia',
          coordinates: coords,
          ...(apt ? { apt } : {}),
        };

        resolve(location);
      });
    });
  };

  return { reverseGeocode };
}
