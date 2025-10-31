import type {
  ArrivalGuide,
  ListingEditorValues,
} from '@/types/host/edit-listing/editListingValues';
import { getTranslation, translate } from '@/utils/i18n';

type SubMapString = Record<string, string | undefined>;

const take = (s?: string, n = 120) =>
  typeof s === 'string' ? (s.length > n ? s.slice(0, n) + '…' : s) : undefined;

export function buildArrivalSubtexts(
  t: ReturnType<typeof getTranslation>,
  values?: ListingEditorValues
): SubMapString {
  const guide = (values?.arrivalGuide as ArrivalGuide) ?? {};
  const indications = guide?.indicationsSection?.indications as
    | string
    | undefined;
  const checkInValue =
    typeof guide?.checkInMethodsSection?.checkInMethods?.checkInMethod ===
    'object'
      ? guide?.checkInMethodsSection?.checkInMethods?.checkInMethod.value
      : guide?.checkInMethodsSection?.checkInMethods;

  const checkInLabel = translate(t, `checkInMethodsOptions.${checkInValue}`);

  const map: SubMapString = {
    directions: take(indications, 160),
    'check-in-method': checkInLabel,
  };

  return map;
}
