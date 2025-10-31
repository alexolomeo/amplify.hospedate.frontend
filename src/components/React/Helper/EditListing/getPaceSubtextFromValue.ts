import type {
  // CustomLinkSection,
  ListingEditorValues,
} from '@/types/host/edit-listing/editListingValues';
import type { Slug } from '../../Utils/edit-listing/slugs';
import {
  getTranslation,
  type SupportedLanguages,
  translate,
} from '@/utils/i18n';
import { type CatalogsSelectors } from '../../Hooks/Host/EditListing/useEditListing';
import type { PropertyTypeGroup } from '@/types/host/edit-listing/editListingCatalog';
import { buildPriceRows } from './priceRows';
import {
  resolveGroupKeyFromName,
  translateGroupNameFromKey,
} from './typeOfProperty';
import { fmt, joinCompact, take } from './_format';
import type {
  GallerySection,
  PricesSection,
  PropertyTypeSection,
  AvailabilitySection,
  PeopleNumberSection,
  HouseRulesSection,
  DescriptionSection,
  LocationSection,
  BookingSettingsSection,
  AmenitiesSection,
  CancellationPolicySection,
} from '@/types/host/edit-listing/editListingValues';
import { AdvanceNoticeHours } from '@/types/enums/calendar/advanceNoticeHours';
import { getAmenityIcons } from './amenities';
import { buildHouseRulesMessages } from './houseRules';
import { buildSafetyItems } from './buildSafetyItems';

export type AmenityItem = { key?: string; label: string; icon?: string };
export type SubValue = string | AmenityItem[];
export type PlaceSubMap = Partial<Record<Slug, SubValue>>;

type I18nLeaf = string;
type I18nDict = { [key: string]: I18nDict | I18nLeaf };

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const getDeep = (obj: I18nDict, path: string[]): unknown => {
  return path.reduce<unknown>((acc, segment) => {
    if (!isObject(acc)) return undefined;
    const next = (acc as Record<string, unknown>)[segment];
    return next;
  }, obj);
};

const makeTranslator =
  (dict: I18nDict) =>
  (key: string): string => {
    const val = getDeep(dict, key.split('.'));
    return typeof val === 'string' ? val : key;
  };

// ---- helpers ----

export function getGroupNameById(
  groups: PropertyTypeGroup[] | undefined,
  id: number | null | undefined
): string | undefined {
  if (!groups || id == null) return undefined;
  return groups.find((g) => g.id === id)?.name;
}
const ensureString = (
  tObj: ReturnType<typeof translate>,
  value: string | undefined,
  i18nKey: string
): string => {
  const v = (value ?? '').trim();
  return v ? v : translate(tObj, i18nKey);
};
const ensureList = (
  tObj: ReturnType<typeof translate>,
  list: AmenityItem[] | undefined,
  i18nKey: string
): AmenityItem[] => {
  const arr = Array.isArray(list) ? list.filter(Boolean) : [];
  return arr.length
    ? arr
    : [{ key: 'placeholder', label: translate(tObj, i18nKey) }];
};

const cancellationValues = [
  {
    id: '1',
    label:
      'hostContent.editListing.content.cancellationPolicy.standardPolicy.flexible.label',
    description:
      'hostContent.editListing.content.cancellationPolicy.standardPolicy.flexible.description',
  },
  {
    id: '2',
    label:
      'hostContent.editListing.content.cancellationPolicy.standardPolicy.moderate.label',
    description:
      'hostContent.editListing.content.cancellationPolicy.standardPolicy.moderate.description',
  },
  {
    id: '3',
    label:
      'hostContent.editListing.content.cancellationPolicy.standardPolicy.firm.label',
    description:
      'hostContent.editListing.content.cancellationPolicy.standardPolicy.firm.description',
  },
  {
    id: '4',
    label:
      'hostContent.editListing.content.cancellationPolicy.standardPolicy.strict.label',
    description:
      'hostContent.editListing.content.cancellationPolicy.standardPolicy.strict.description',
  },
];

type CancellationField = 'label' | 'description';

function getCancellationValueById(
  id: string,
  field: CancellationField = 'label'
): string | undefined {
  const item = cancellationValues.find((item) => item.id === id);
  return item ? item[field] : undefined;
}

/**
 * @param values ListingEditorValues
 * @param locale
 * @returns PlaceSubMap
 */
export function getPlaceSubtextsFromValues(
  locale: SupportedLanguages,
  selectors: CatalogsSelectors,
  values?: ListingEditorValues
): PlaceSubMap {
  if (!values) return {};
  const t = getTranslation(locale);
  const rawDict = getTranslation(locale) as unknown;
  const dict: I18nDict = (
    typeof rawDict === 'object' && rawDict !== null ? (rawDict as I18nDict) : {}
  ) as I18nDict;

  const tr = makeTranslator(dict);

  const yp = values.yourPlace ?? {};

  const gallery = (yp.gallerySection ?? {}) as GallerySection;
  const title = (yp.titleSection ?? {}) as { listingTitle?: string };
  const prop = (yp.propertyTypeSection ?? {}) as PropertyTypeSection;
  const price = (yp.pricesSection ?? {}) as PricesSection;
  const avail = (yp.availabilitySection ?? {}) as AvailabilitySection;
  const capacity = (yp.peopleNumberSection ?? {}) as PeopleNumberSection;
  const desc = (yp.descriptionSection ?? {}) as DescriptionSection;
  const amenities = (yp.amenitiesSection ?? {}) as AmenitiesSection;
  const location = (yp.locationSection ?? {}) as LocationSection;
  const booking = (yp.bookingSettingsSection ?? {}) as BookingSettingsSection;
  const rules = (yp.houseRulesSection ?? {}) as HouseRulesSection;
  const cancel = (yp.cancellationPolicySection ??
    {}) as CancellationPolicySection;
  // const link = (yp.customLinkSection ?? {}) as CustomLinkSection;

  // Place Info
  const placeInfo = gallery.placeInfo ?? {};
  const bedNumber = placeInfo.bedNumber;
  const bathNumber = placeInfo.bathNumber;
  const roomNumber = placeInfo.roomNumber;

  // Availability
  const advanceKey =
    AdvanceNoticeHours[
      avail.notice?.advanceNoticeHours
        ?.id as unknown as keyof typeof AdvanceNoticeHours
    ];
  const advanceHours = advanceKey
    ? translate(
        t,
        `hostContent.editListing.content.editAvailability.noticeOptions.${advanceKey}`
      )
    : undefined;
  const stayMin = avail.tripDuration?.min;
  const stayMax = avail.tripDuration?.max;

  // Capacity
  const guestsLabel =
    capacity.peopleNumber === 1
      ? t.hostContent.editListing.content.editCapacity.options[0] // "1 guest"
      : translate(t, 'hostContent.editListing.content.manyGuests', {
          num: capacity.peopleNumber,
        });

  // Amenities
  const ids = amenities.amenities?.values ?? [];
  const icons = getAmenityIcons(selectors, ids);
  const formattedAmenities =
    icons.length > 6
      ? [
          ...icons.slice(0, 6).map((icon) => ({
            key: icon,
            label: translate(t, `amenities.${icon}`),
          })),
          { key: 'more', label: translate(t, 'more') },
        ]
      : icons.map((icon) => ({
          key: icon,
          label: translate(t, `amenities.${icon}`),
        }));

  // Directions
  const locData = location.locationData ?? {};
  const addressLine = locData.address ? locData.address.split('\n')[0] : '';
  const formattedAddress = joinCompact(
    [addressLine, locData.city, locData.country.value],
    ', '
  );

  //House Rules
  const houseRules = buildHouseRulesMessages(
    rules,
    t,
    locale?.toString().startsWith('en') ? 'en' : 'es'
  );

  // Security
  const safetyItems = buildSafetyItems(
    values.yourPlace?.guestSecuritySection,
    tr
  );

  // Type of Property
  const groupsDict = (t?.hostContent?.editListing?.content?.editPropertyType
    ?.groups ?? {}) as Record<string, string>;

  const selectedGroupId = prop.propertyTypeGroup?.value;
  const groupNameEn = getGroupNameById(
    selectors.propertyTypeGroups,
    selectedGroupId
  );
  const groupKey = resolveGroupKeyFromName(groupNameEn);
  const propertyTypeLabel = translateGroupNameFromKey(
    groupsDict,
    groupKey,
    groupNameEn
  );

  //Price
  const priceRows = buildPriceRows(tr, price);

  // CONJUNCTION
  const safeTitle = ensureString(
    t,
    take(String(title.listingTitle || '')),
    'hostContent.editListing.preview.placeholders.title'
  );

  const safePhotoGallery = ensureString(
    t,
    joinCompact([
      fmt(
        tr,
        bedNumber,
        'listingDetail.capacity.bed',
        'listingDetail.capacity.bed_plural'
      ),
      fmt(
        tr,
        bathNumber,
        'listingDetail.capacity.bathroom',
        'listingDetail.capacity.bathroom_plural'
      ),
      fmt(
        tr,
        roomNumber,
        'listingDetail.capacity.room',
        'listingDetail.capacity.room_plural'
      ),
    ]),
    'hostContent.editListing.preview.placeholders.photoGallery'
  );

  const safePropertyType = ensureString(
    t,
    propertyTypeLabel,
    'hostContent.editListing.preview.placeholders.propertyType'
  );

  const safeAddress = ensureString(
    t,
    formattedAddress,
    'hostContent.editListing.preview.placeholders.address'
  );

  // const safeCustomLink = ensureString(
  //   t,
  //   link.customLink ? String(link.customLink) : '',
  //   'hostContent.editListing.preview.placeholders.customLink'
  // );

  const safePrice = ensureList(
    t,
    priceRows,
    'hostContent.editListing.preview.placeholders.price'
  );

  const availabilityList = [
    {
      key: 'staysRange',
      label: translate(
        t,
        'hostContent.editListing.content.editAvailability.staysRange',
        { min: stayMin, max: stayMax }
      ),
    },
    { key: 'callHours', label: advanceHours || undefined },
  ].filter((item) => !!item.label) as AmenityItem[];

  const safeAvailability = ensureList(
    t,
    availabilityList,
    'hostContent.editListing.preview.placeholders.availability'
  );

  const safeCapacity = ensureList(
    t,
    [{ key: 'numberGuests', label: guestsLabel }].filter(
      (it) => !!it.label
    ) as AmenityItem[],
    'hostContent.editListing.preview.placeholders.capacity'
  );

  const descriptionList = [
    {
      key: 'description',
      label: desc?.generalDescription?.listingDescription ?? '',
    },
  ].filter((it) => !!it.label) as AmenityItem[];
  const safeDescription = ensureList(
    t,
    descriptionList,
    'hostContent.editListing.preview.placeholders.description'
  );

  const safeAmenities = ensureList(
    t,
    formattedAmenities,
    'hostContent.editListing.preview.placeholders.amenities'
  );

  const bookingList = [
    booking?.bookingType?.value
      ? {
          key: booking.bookingType.value,
          label:
            booking.bookingType.value === 'APPROVAL_REQUIRED'
              ? translate(
                  t,
                  'hostContent.editListing.content.booking.approveAllReservations'
                )
              : translate(
                  t,
                  'hostContent.editListing.content.booking.instantBooking'
                ),
        }
      : undefined,
  ].filter(Boolean) as AmenityItem[];
  const safeBooking = ensureList(
    t,
    bookingList,
    'hostContent.editListing.preview.placeholders.booking'
  );

  const safeHouseRules = ensureList(
    t,
    houseRules,
    'hostContent.editListing.preview.placeholders.houseRules'
  );

  const safeGuestSafety = ensureList(
    t,
    safetyItems,
    'hostContent.editListing.preview.placeholders.guestSafety'
  );

  const cnTitle = getCancellationValueById(
    cancel?.standardPolicy?.value?.toString() ?? ''
  );
  const cnDesc = getCancellationValueById(
    cancel?.standardPolicy?.value?.toString() ?? '',
    'description'
  );

  const cancellationList = [
    cnTitle ? { key: 'title', label: translate(t, cnTitle) } : undefined,
    cnDesc ? { key: 'description', label: translate(t, cnDesc) } : undefined,
  ].filter(Boolean) as AmenityItem[];

  const safeCancellation = ensureList(
    t,
    cancellationList,
    'hostContent.editListing.preview.placeholders.cancellation'
  );

  const map: PlaceSubMap = {
    'request-changes': '',

    'photo-gallery': safePhotoGallery,

    title: safeTitle,

    'property-type': safePropertyType,

    price: safePrice,

    availability: safeAvailability,

    capacity: safeCapacity,

    description: safeDescription,

    amenities: safeAmenities,

    address: safeAddress,

    booking: safeBooking,

    'house-rules': safeHouseRules,

    'guest-safety': safeGuestSafety,

    'cancellation-policy': safeCancellation,

    // 'custom-link': safeCustomLink,
  };

  return map;
}

export function getPaceSubtextFromValue(
  locale: SupportedLanguages,
  selectors: CatalogsSelectors,
  values?: ListingEditorValues
): PlaceSubMap {
  return getPlaceSubtextsFromValues(locale, selectors, values);
}

export default getPlaceSubtextsFromValues;
