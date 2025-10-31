import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import type { CatalogsSelectors } from '@/components/React/Hooks/Host/EditListing/useEditListing';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { AvailabilityForm, NoticeKey } from './availabilityValidators';

/* helpers */

function parseIntSafe(raw: string): number {
  const n = Number.parseInt((raw ?? '').trim(), 10);
  return Number.isFinite(n) ? Math.floor(n) : 0;
}

function mapNoticeKeyToId(
  key: NoticeKey,
  selectors: CatalogsSelectors
): number {
  const found = selectors.advanceNoticeHours.find((h) => h.name === key);
  if (!found) {
    throw new Error(`Notice key not found in catalog: ${key}`);
  }
  return found.id;
}

function mapCutoffLabelToId(
  label: string,
  selectors: CatalogsSelectors
): number {
  const found = selectors.sameDayAdvanceNoticeTimes.find(
    (c) => c.name === label
  );
  if (!found) {
    throw new Error(`Same-day cutoff not found for label: ${label}`);
  }
  return found.id;
}

/* values -> form */

export function toAvailabilityForm(
  initialValues: ListingEditorValues | null,
  selectors: CatalogsSelectors
): AvailabilityForm {
  const avail = initialValues?.yourPlace?.availabilitySection;

  const minNightsRaw =
    avail?.tripDuration?.min != null ? String(avail.tripDuration.min) : '';
  const maxNightsRaw =
    avail?.tripDuration?.max != null ? String(avail.tripDuration.max) : '';

  let noticeKey: NoticeKey | null = null;
  const noticeId = avail?.notice?.advanceNoticeHours?.id;
  if (typeof noticeId === 'number') {
    const found = selectors.advanceNoticeHours.find((h) => h.id === noticeId);
    if (found) noticeKey = found.name as NoticeKey;
  }

  let sameDayCutoffLabel: string | null = null;
  if (noticeKey === 'SAME_DAY') {
    const cutoffId = avail?.notice?.sameDayAdvanceNoticeTime?.id;
    if (typeof cutoffId === 'number') {
      const cut = selectors.sameDayAdvanceNoticeTimes.find(
        (c) => c.id === cutoffId
      );
      if (cut) sameDayCutoffLabel = cut.name;
    }
  }

  const allowRequestSameDay = Boolean(avail?.notice?.allowRequestSameDay);

  return {
    minNightsRaw,
    maxNightsRaw,
    noticeKey,
    sameDayCutoffLabel,
    allowRequestSameDay,
  };
}

/* form -> payload */

export function toAvailabilityPayload(
  form: AvailabilityForm,
  selectors: CatalogsSelectors
): UpdateListingEditorPayload {
  const min = parseIntSafe(form.minNightsRaw);
  const max = parseIntSafe(form.maxNightsRaw);

  const payload: UpdateListingEditorPayload = {
    yourPlace: {
      availabilitySection: {
        tripDuration: { min, max },
      },
    },
  };

  if (form.noticeKey) {
    const noticeId = mapNoticeKeyToId(form.noticeKey, selectors);

    const notice: {
      advanceNoticeHours: { id: number };
      allowRequestSameDay: boolean;
      sameDayAdvanceNoticeTime?: { id: number };
    } = {
      advanceNoticeHours: { id: noticeId },
      allowRequestSameDay: Boolean(form.allowRequestSameDay),
    };

    if (form.noticeKey === 'SAME_DAY' && form.sameDayCutoffLabel) {
      const cutoffId = mapCutoffLabelToId(form.sameDayCutoffLabel, selectors);
      notice.sameDayAdvanceNoticeTime = { id: cutoffId };
    }

    payload.yourPlace!.availabilitySection!.notice = notice;
  }

  return payload;
}
