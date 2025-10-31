import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import {
  SC_KEYS,
  SD_KEYS,
  PI_KEYS,
  type SCKey,
  type SDKey,
  type PIKey,
  type DetailKey,
  type GuestSafetyForm,
  toYesNo,
} from './guestSafetyValidators';

/** values (server/working) -> form */
export function toGuestSafetyForm(
  values: ListingEditorValues | null
): GuestSafetyForm {
  const sc: Record<SCKey, boolean> = Object.fromEntries(
    SC_KEYS.map((k) => [
      k,
      !!values?.yourPlace?.guestSecuritySection?.safetyConsiderations?.[k]
        ?.status,
    ])
  ) as Record<SCKey, boolean>;

  const sd: Record<SDKey, boolean> = Object.fromEntries(
    SD_KEYS.map((k) => [
      k,
      !!values?.yourPlace?.guestSecuritySection?.safetyDevices?.[k]?.status,
    ])
  ) as Record<SDKey, boolean>;

  const pi: Record<PIKey, boolean> = Object.fromEntries(
    PI_KEYS.map((k) => [
      k,
      !!values?.yourPlace?.guestSecuritySection?.propertyInformation?.[k]
        ?.status,
    ])
  ) as Record<PIKey, boolean>;

  const detailsEntries: Array<[DetailKey, string]> = [];

  SC_KEYS.forEach((k) => {
    const d =
      values?.yourPlace?.guestSecuritySection?.safetyConsiderations?.[k]
        ?.details;
    if (d) detailsEntries.push([`sc.${k}`, d]);
  });
  SD_KEYS.forEach((k) => {
    const d =
      values?.yourPlace?.guestSecuritySection?.safetyDevices?.[k]?.details;
    if (d) detailsEntries.push([`sd.${k}`, d]);
  });
  PI_KEYS.forEach((k) => {
    const d =
      values?.yourPlace?.guestSecuritySection?.propertyInformation?.[k]
        ?.details;
    if (d) detailsEntries.push([`pi.${k}`, d]);
  });

  const details = Object.fromEntries(
    detailsEntries
  ) as GuestSafetyForm['details'];

  return { sc, sd, pi, details };
}

/** form -> PATCH mínimo */
export function toGuestSafetyPayload(
  form: GuestSafetyForm
): UpdateListingEditorPayload {
  const scPayload = Object.fromEntries(
    SC_KEYS.map((k) => {
      const key = `sc.${k}` as DetailKey;
      return [k, toYesNo(form.sc[k], form.details[key] ?? null)];
    })
  );

  const sdPayload = Object.fromEntries(
    SD_KEYS.map((k) => {
      const key = `sd.${k}` as DetailKey;
      return [k, toYesNo(form.sd[k], form.details[key] ?? null)];
    })
  );

  const piPayload = Object.fromEntries(
    PI_KEYS.map((k) => {
      const key = `pi.${k}` as DetailKey;
      return [k, toYesNo(form.pi[k], form.details[key] ?? null)];
    })
  );

  return {
    yourPlace: {
      guestSecuritySection: {
        safetyConsiderations: scPayload,
        safetyDevices: sdPayload,
        propertyInformation: piPayload,
      },
    },
  };
}
