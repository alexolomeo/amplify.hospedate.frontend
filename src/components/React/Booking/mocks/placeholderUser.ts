import type { Photo } from '@/types/listing/space';

const mockPhoto: Photo = {
  original: '/images/placeholder-avatar.jpg',
  srcsetAvif: '',
  srcsetWebp: '',
};

export const placeholderHost = {
  username: 'Juan',
  profilePicture: mockPhoto,
  score: 4.8,
};
