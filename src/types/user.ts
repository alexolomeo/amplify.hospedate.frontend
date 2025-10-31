import type { RecentReviews } from './listing/review';
import type { Photo } from './listing/space';

export interface UserInfo {
  showBirthDecade?: boolean;
  work?: string;
  travelDream?: string;
  pets?: string;
  school?: string;
  funFact?: string;
  uselessSkill?: string;
  wastedTime?: string;
  favoriteSong?: string;
  biographyTitle?: string;
  obsession?: string;
  about?: string;
  languages?: Language[];
  birthDecade?: number;
}

export interface User {
  username: string;
  profilePicture: Photo;
  city: string;
  state: string;
  country: string;
  score?: number;
  becameHostAt?: string | null;
  becameUserAt: string;
  isHost: boolean;
  info?: UserInfo;
  trips?: Trip[];
  totalTrips?: number;
  interests?: Interest[];
  listings?: Listing[];
  reviews?: Review;
  identityVerified: boolean;
  emailVerified: boolean;
  isSuperHost: boolean;
  phoneVerified: boolean;
}

export interface Language {
  id: number;
  name: string;
  selected: boolean;
}
export interface Trip {
  city: string;
  country: string;
}

export interface Interest {
  id: number;
  name: string;
  icon: string;
  selected: boolean;
}
export interface Listing {
  id: number;
  title: string;
  score?: number;
  propertyType: string;
  photo: Photo;
}
export interface Review {
  fromGuests: RecentReviews[];
  fromHosts: RecentReviews[];
  totalGuestsReviews: number;
  totalHostsReviews: number;
}

export interface UserMe {
  id: number;
  identityVerified: boolean;
  profilePicture: Photo;
  address?: string;
  birthDate: string;
  city?: string;
  country?: string;
  email: string;
  firstName: string;
  isRegisterCompleted: boolean;
  lastName: string;
  phone: string;
  preferredName: string;
  state?: string;
  isSuperHost: boolean;
  isHost: boolean;
  provider?: string;
}

export interface LoginInfo {
  lastUpdatedPassword: string;
  socialNetwork: string;
}

export interface UserStore {
  firstName: string;
  profilePicture?: Photo;
  email: string;
  identityVerified: boolean;
  isRegisterCompleted: boolean;
  isHost: boolean;
  id?: number;
}
