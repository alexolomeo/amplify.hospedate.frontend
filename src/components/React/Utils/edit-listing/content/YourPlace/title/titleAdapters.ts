import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { TitleForm } from './titleValidators';
import { normalizeTitleForPatch } from './titleValidators';

/** values → form */
export function toTitleForm(
  initialValues: ListingEditorValues | null
): TitleForm {
  const safeInitial =
    initialValues ??
    ({
      yourPlace: { titleSection: { listingTitle: '' } },
    } as ListingEditorValues);

  const raw = safeInitial.yourPlace?.titleSection?.listingTitle ?? '';

  return { title: String(raw) };
}

/** form → payload (bloque mínimo para PATCH) */
export function toTitlePayload(form: TitleForm): UpdateListingEditorPayload {
  return {
    yourPlace: {
      titleSection: {
        listingTitle: normalizeTitleForPatch(form.title),
      },
    },
  };
}
