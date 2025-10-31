import type { Listing } from '@/types/host/listing';

export function resolveHref(listing: Listing): string | null {
  const { id, status } = listing;

  if (status === 'IN_PROGRESS') {
    return `/listing/create/${id}`;
  }

  if (
    status === 'PENDING_APPROVAL' ||
    status === 'APPROVED' ||
    status === 'UNLISTED' ||
    status === 'CHANGES_REQUESTED' ||
    status === 'PUBLISHED'
  ) {
    return `/hosting/listing/edit/${id}/overview`;
  }

  return null;
}
