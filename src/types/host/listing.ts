export type Status =
  | 'PUBLISHED'
  | 'CHANGES_REQUESTED'
  | 'IN_PROGRESS'
  | 'UNLISTED'
  | 'APPROVED'
  | 'PENDING_APPROVAL'
  | 'BLOCKED';

export interface PlaceType {
  name: string;
  icon: string;
}

export interface Listing {
  id: number;
  title?: string | null;
  status: Status;
  createdAt: string;
  propertyType: string;
  location?: {
    address: string;
    apt?: string;
    city: string;
    state: string;
    country: string;
  } | null;
  photo?: {
    original: string;
    srcsetWebp: string;
    srcsetAvif: string;
  } | null;
}

export interface ListingsResponse {
  limit: number;
  offset: number;
  count: number;
  next: string | null;
  previous: string | null;
  results: Listing[];
}
