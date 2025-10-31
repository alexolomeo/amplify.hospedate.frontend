import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api.ts';
import type { User } from '@/types/user';
import {
  getProfileInfo,
  updateProfileInfo,
  updateProfilePhoto,
} from '@/services/users-profile';
import type { UpdateUserInfo } from '@/services/users-profile';

vi.mock('@/utils/api', () => {
  return {
    default: {
      get: vi.fn(),
      put: vi.fn(),
    },
  };
});

describe('getProfileInfo', () => {
  it('should return user profile on success', async () => {
    const testUser: User = {
      username: 'Luis',
      profilePicture: {
        original: 'http://example.com/image-1.jpeg',
        srcsetWebp:
          'http://example.com/image-1-480.webp 480w, http://example.com/image-1-768.webp 768w',
        srcsetAvif:
          'http://example.com/image-1-480.avif 480w, http://example.com/image-1-768.avif 768w',
      },
      city: 'Cochabamba',
      state: 'Cochabamba',
      country: 'Bolivia',
      score: 3.87,
      becameHostAt: null,
      becameUserAt: '2024-01-21',
      isSuperHost: false,
      isHost: false,
      phoneVerified: true,
      info: {
        showBirthDecade: true,
        work: 'Professional Basketball Instructor',
        travelDream: 'Santa Cruz',
        pets: 'Dog and cat lover',
        school: 'Universidad Cochabamba',
        funFact: 'Lorem ipsum dolor sit amet',
        uselessSkill: 'Can speak backwards',
        wastedTime: 'Watching cat videos',
        favoriteSong: 'Bolivian Folk Song',
        biographyTitle: 'Living life to the fullest',
        obsession: 'Coffee and mate',
        birthDecade: 40,
        about: 'traveler, photographer, dreamer ✈️',
        languages: [
          {
            id: 1,
            name: 'English',
            selected: true,
          },
        ],
      },
      trips: [
        {
          city: 'Cochabamba',
          country: 'Bolivia',
        },
        {
          city: 'Tarija',
          country: 'Bolivia',
        },
        {
          city: 'Sucre',
          country: 'Bolivia',
        },
      ],
      interests: [
        {
          id: 1,
          selected: true,
          name: 'Baseball',
          icon: 'Music',
        },
        {
          id: 2,
          selected: true,
          name: 'Building things',
          icon: 'Art',
        },
      ],
      listings: [],
      reviews: {
        fromGuests: [],
        fromHosts: [],
        totalGuestsReviews: 0,
        totalHostsReviews: 0,
      },
      identityVerified: true,
      emailVerified: true,
    };
    (api.get as Mock).mockResolvedValueOnce({ data: testUser });
    const result = await getProfileInfo();
    expect(result).toEqual(testUser);
    expect(api.get).toHaveBeenCalledWith('/users/profile/retrieve');
  });

  it('should return null on error', async () => {
    (api.get as Mock).mockRejectedValueOnce(new Error('Network Error'));
    const result = await getProfileInfo();
    expect(result).toBeNull();
    expect(api.get).toHaveBeenCalledWith('/users/profile/retrieve');
  });
});

describe('updateProfileInfo', () => {
  it('should update profile info successfully', async () => {
    const updateData: UpdateUserInfo = {
      info: {
        show_birth_decade: true,
        work: 'Software Developer',
        travel_dream: 'Japan',
        pets: 'Cat lover',
        school: 'University',
        fun_fact: 'I love coding',
        useless_skill: 'Can solve Rubik cube',
        wasted_time: 'Social media',
        favorite_song: 'My favorite song',
        biography_title: 'My life story',
        obsession: 'Technology',
        about: 'Passionate developer',
        languages: [1, 2],
      },
      interests: [1, 2, 3],
    };
    (api.put as Mock).mockResolvedValueOnce({ data: {} });
    await expect(updateProfileInfo(updateData)).resolves.toBeUndefined();
    expect(api.put).toHaveBeenCalledWith('/users/profile-info', updateData);
  });

  it('should throw error on failure', async () => {
    const updateData: UpdateUserInfo = {
      info: {
        show_birth_decade: true,
        work: 'Software Developer',
        travel_dream: 'Japan',
        pets: 'Cat lover',
        school: 'University',
        fun_fact: 'I love coding',
        useless_skill: 'Can solve Rubik cube',
        wasted_time: 'Social media',
        favorite_song: 'My favorite song',
        biography_title: 'My life story',
        obsession: 'Technology',
        about: 'Passionate developer',
        languages: [1, 2],
      },
      interests: [1, 2, 3],
    };
    (api.put as Mock).mockRejectedValueOnce(new Error('Update failed'));
    await expect(updateProfileInfo(updateData)).rejects.toThrow(
      'Failed to update User Profile Info'
    );
    expect(api.put).toHaveBeenCalledWith('/users/profile-info', updateData);
  });
});

describe('updateProfilePhoto', () => {
  it('should update profile photo successfully', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    (api.put as Mock).mockResolvedValueOnce({ data: {} });
    await expect(updateProfilePhoto(mockFile)).resolves.toBeUndefined();
    expect(api.put).toHaveBeenCalledWith(
      '/users/profile-photo',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  });

  it('should throw error on failure', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    (api.put as Mock).mockRejectedValueOnce(new Error('Upload failed'));
    await expect(updateProfilePhoto(mockFile)).rejects.toThrow(
      'Failed to update User Profile Photo'
    );
    expect(api.put).toHaveBeenCalledWith(
      '/users/profile-photo',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  });
});
