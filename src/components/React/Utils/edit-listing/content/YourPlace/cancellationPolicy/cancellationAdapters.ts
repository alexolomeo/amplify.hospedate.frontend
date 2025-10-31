import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import {
  isValidStandard,
  isValidLongStay,
  type StandardPolicyId,
  type LongStayPolicyId,
} from '@/components/React/Utils/edit-listing/cancellationPolicy';
import type { CancellationForm } from './cancellationValidators';

/** values → form */
export function toCancellationForm(
  initialValues: ListingEditorValues | null
): CancellationForm {
  const stdRaw =
    initialValues?.yourPlace?.cancellationPolicySection?.standardPolicy
      ?.value ?? null;
  const longRaw =
    initialValues?.yourPlace?.cancellationPolicySection?.longStayPolicy
      ?.value ?? null;

  const stdStr = String(stdRaw ?? '1') as string;
  const longStr = String(longRaw ?? '5') as string;

  const standardId: StandardPolicyId = isValidStandard(stdStr) ? stdStr : '1';
  const longStayId: LongStayPolicyId = isValidLongStay(longStr) ? longStr : '5';

  return { standardId, longStayId };
}

/** form → payload */
export function toCancellationPayload(
  form: CancellationForm
): UpdateListingEditorPayload {
  const std = parseInt(form.standardId, 10);
  const lng = parseInt(form.longStayId, 10);

  return {
    yourPlace: {
      cancellationPolicySection: {
        standardPolicy: { value: std },
        longStayPolicy: { value: lng },
      },
    },
  };
}
