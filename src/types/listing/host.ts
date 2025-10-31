import type { Photo } from './space';

export interface Host {
  id: number;
  username: string;
  profilePicture: Photo;
  city?: string;
  state?: string;
  country?: string;
  score?: number;
  responseRate: string;
  responseTime: string;
  becameHostAt: string;
  isSuperHost: boolean;
  totalReviews?: number;
  info?: {
    birthDecade?: number;
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
    languages?: string[];
  };
}
