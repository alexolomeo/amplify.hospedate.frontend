import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import type { HouseRulesForm } from './houseRulesValidators';
import {
  FLEXIBLE_ID,
  PETS_MAX,
  PETS_MIN,
  GUEST_MAX,
  GUEST_MIN,
} from './houseRulesValidators';

export type ToFormParams = {
  initialQuietEnabled?: boolean;
  initialQuietStartId?: number | null;
  initialQuietEndId?: number | null;

  initialCheckinStartId?: number | null;
  initialCheckinEndId?: number | null;
  initialCheckoutId?: number | null;

  initialPermissions?: {
    petsAllowed?: boolean;
    numPets?: number;
    eventsAllowed?: boolean;
    smokingAllowed?: boolean;
    commercialPhotographyAllowed?: boolean;
    guestNumber?: number;
  };

  initialAdditionalRulesText?: string;
};

export function toHouseRulesForm(p: ToFormParams): HouseRulesForm {
  const petsAllowed = !!p.initialPermissions?.petsAllowed;
  const rawNumPets = Number(p.initialPermissions?.numPets ?? 0);
  const numPets = petsAllowed ? rawNumPets : 0;
  const guestNumber = Number(p.initialPermissions?.guestNumber ?? 1);

  return {
    permissions: {
      petsAllowed,
      numPets,
      eventsAllowed: !!p.initialPermissions?.eventsAllowed,
      smokingAllowed: !!p.initialPermissions?.smokingAllowed,
      commercialPhotographyAllowed:
        !!p.initialPermissions?.commercialPhotographyAllowed,
      guestNumber,
    },
    quietHours: {
      isEnabled: !!p.initialQuietEnabled,
      startId: p.initialQuietStartId ?? null,
      endId: p.initialQuietEndId ?? null,
    },
    checkInOut: {
      checkInStartId: p.initialCheckinStartId ?? null,
      checkInEndId: p.initialCheckinEndId ?? null,
      checkoutId: p.initialCheckoutId ?? null,
    },
    additionalRulesText: p.initialAdditionalRulesText ?? '',
  };
}

type YourPlaceNN = NonNullable<UpdateListingEditorPayload['yourPlace']>;
type HouseRulesNN = NonNullable<YourPlaceNN['houseRulesSection']>;

export function toHouseRulesPayload(
  form: HouseRulesForm
): UpdateListingEditorPayload {
  const numPetsNormalized = form.permissions.petsAllowed
    ? Math.max(PETS_MIN, Math.min(PETS_MAX, form.permissions.numPets))
    : 0;

  const guestNormalized = Math.max(
    GUEST_MIN,
    Math.min(GUEST_MAX, form.permissions.guestNumber)
  );

  // quietHours → { value }
  const quietHoursBlock: HouseRulesNN['quietHours'] = form.quietHours.isEnabled
    ? {
        isEnabled: true,
        ...(form.quietHours.startId != null
          ? { startTime: { value: form.quietHours.startId } }
          : {}),
        ...(form.quietHours.endId != null
          ? { endTime: { value: form.quietHours.endId } }
          : {}),
      }
    : { isEnabled: false };

  // checkInOut → { value }
  const { checkInStartId, checkInEndId, checkoutId } = form.checkInOut;
  if (checkInStartId == null || checkoutId == null) {
    throw new Error(
      'Cannot build house rules payload without check-in start and checkout times.'
    );
  }

  const checkInOutBlock: HouseRulesNN['checkInOut'] = {
    checkInStartTime: { value: checkInStartId },
    ...(checkInStartId === FLEXIBLE_ID || checkInEndId == null
      ? {}
      : { checkInEndTime: { value: checkInEndId } }),
    checkoutTime: { value: checkoutId },
  };

  const trimmed = form.additionalRulesText.trim();

  return {
    yourPlace: {
      houseRulesSection: {
        permissions: {
          petsAllowed: form.permissions.petsAllowed,
          numPets: numPetsNormalized,
          eventsAllowed: form.permissions.eventsAllowed,
          smokingAllowed: form.permissions.smokingAllowed,
          commercialPhotographyAllowed:
            form.permissions.commercialPhotographyAllowed,
          guestNumber: guestNormalized,
        },
        quietHours: quietHoursBlock,
        checkInOut: checkInOutBlock,
        additionalRules: {
          text: trimmed === '' ? null : trimmed,
        },
      },
    },
  };
}
