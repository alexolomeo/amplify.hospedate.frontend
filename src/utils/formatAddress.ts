import type { Listing } from '@/types/listing/listing';

export function formatAddress(listing: Pick<Listing, 'location'>) {
  return [
    listing.location.address,
    listing.location.city,
    listing.location.state,
  ]
    .filter(Boolean)
    .join(', ');
}
