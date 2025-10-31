import type { HouseRulesSection } from '@/types/host/edit-listing/editListingValues';
import { getTranslation, translate } from '@/utils/i18n';

function formatHour(value: number, lang: 'en' | 'es'): string {
  const date = new Date();
  date.setHours(value, 0, 0, 0);
  return date.toLocaleTimeString(lang === 'en' ? 'en-US' : 'es-ES', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

const houseRuleIconMap = {
  checkIn: 'additional-rules',
  checkOut: 'clock',
  quietHours: 'quiet-hours',
  petsNotAllowed: 'without-pet',
  petsAllowedMax: 'pet',
  petsAllowed: 'pet',
  smokingAllowed: 'smoke',
  smokingNotAllowed: 'smoke-disabled',
} as const;

type HouseRuleItem = { key: string; label: string };

export function buildHouseRulesMessages(
  houseRules: HouseRulesSection | undefined,
  t: ReturnType<typeof getTranslation>,
  lang: 'en' | 'es' = 'es'
): HouseRuleItem[] {
  const items: HouseRuleItem[] = [];
  if (!houseRules) return items;

  // Check-in / Check-out
  const checkInStartVal = houseRules.checkInOut?.checkInStartTime?.value;
  const checkInEndVal = houseRules.checkInOut?.checkInEndTime?.value;
  const checkoutVal = houseRules.checkInOut?.checkoutTime?.value;

  if (
    typeof checkInStartVal === 'number' &&
    typeof checkInEndVal === 'number'
  ) {
    items.push({
      key: houseRuleIconMap.checkIn,
      label: translate(t, 'houseRules.checkIn', {
        start: formatHour(checkInStartVal, lang),
        end: formatHour(checkInEndVal, lang),
      }),
    });
  }

  if (typeof checkoutVal === 'number') {
    items.push({
      key: houseRuleIconMap.checkOut,
      label: translate(t, 'houseRules.checkOut', {
        time: formatHour(checkoutVal, lang),
      }),
    });
  }

  // Quiet hours
  const qh = houseRules.quietHours;
  if (
    qh?.isEnabled &&
    typeof qh.startTime?.value === 'number' &&
    typeof qh.endTime?.value === 'number'
  ) {
    items.push({
      key: houseRuleIconMap.quietHours,
      label: translate(t, 'houseRules.quietHours', {
        start: formatHour(qh.startTime.value, lang),
        end: formatHour(qh.endTime.value, lang),
      }),
    });
  }

  // Permissions
  const perms = houseRules.permissions;
  if (perms) {
    if (!perms.petsAllowed) {
      items.push({
        key: houseRuleIconMap.petsNotAllowed,
        label: translate(t, 'houseRules.petsNotAllowed'),
      });
    } else if (typeof perms.numPets === 'number' && perms.numPets > 0) {
      items.push({
        key: houseRuleIconMap.petsAllowedMax,
        label: translate(t, 'houseRules.petsAllowedMax', {
          count: perms.numPets,
        }),
      });
    } else {
      items.push({
        key: houseRuleIconMap.petsAllowed,
        label: translate(t, 'houseRules.petsAllowed'),
      });
    }

    items.push({
      key: perms.smokingAllowed
        ? houseRuleIconMap.smokingAllowed
        : houseRuleIconMap.smokingNotAllowed,
      label: translate(
        t,
        perms.smokingAllowed
          ? 'houseRules.smokingAllowed'
          : 'houseRules.smokingNotAllowed'
      ),
    });
  }

  return items;
}
