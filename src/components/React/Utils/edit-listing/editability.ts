import type { ListingStatus } from '@/types/host/edit-listing/editListingValues';

export type EditMode = 'edit' | 'readOnly';

const EDITABLE: ListingStatus[] = [
  'CHANGES_REQUESTED',
  'PUBLISHED',
  'UNLISTED',
];

export function getEditModeForStatus(status?: ListingStatus): EditMode {
  if (!status) return 'edit';
  return EDITABLE.includes(status) ? 'edit' : 'readOnly';
}
