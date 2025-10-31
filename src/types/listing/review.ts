import type { SortReview } from '../enums/sortReview';
import type { Photo } from './space';

export interface Review {
  totalReviews: number;
  recentReviews: RecentReviews[];
}
export interface RecentReviews {
  user: {
    id: number;
    username: string;
    profilePicture: Photo;
    city?: string;
    state?: string;
    country?: string;
    becameUserAt: string;
  };
  score: number;
  comment: string;
  date: string;
  trip: {
    startDate: string;
    endDate: string;
    pets: number;
    infants: number;
  };
}

export interface QueryParamsReviews {
  limit: number;
  offset: number;
  sort: SortReview;
}
export interface QueryParamsReviewsSearch {
  limit: number;
  offset: number;
  sort: SortReview;
  criteria: string;
}

export interface PaginatedReviews {
  limit: number;
  offset: number;
  count: number;
  next: string | null;
  previous: string | null;
  results: RecentReviews[];
}
