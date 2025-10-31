import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api.ts';
import type { User, UserMe } from '@/types/user';
import { fetchUserMe, fetchUsersById } from '@/services/users';
import { $userStore } from '@/stores/userStore';

vi.mock('@/utils/api', () => {
  return {
    default: {
      get: vi.fn(),
      patch: vi.fn(),
    },
  };
});

vi.mock('@/stores/userStore', () => ({
  $userStore: {
    set: vi.fn(),
  },
}));

describe('userById', () => {
  it('should return user on success', async () => {
    const id = 1;
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
        about: 'traveler, photographer, dreamer ✈️',
        birthDecade: 40,
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
        {
          id: 3,
          selected: true,
          name: 'Baseball',
          icon: 'Music',
        },
        {
          id: 4,
          selected: true,
          name: 'Cheerleading',
          icon: 'Movie',
        },
      ],
      listings: [],
      reviews: {
        fromGuests: [],
        fromHosts: [
          {
            user: {
              username: 'Daniel',
              profilePicture: {
                original:
                  'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.jpg',
                srcsetWebp:
                  'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1920w',
                srcsetAvif:
                  'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1920w',
              },
              city: 'Santa Cruz',
              state: 'Santa Cruz',
              country: 'Bolivia',
              id: 6948,
              becameUserAt: '2024-09-03',
            },
            score: 4.04,
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            date: '2026-10-04',
            trip: {
              startDate: '2025-06-05',
              endDate: '2025-11-20',
              pets: 1,
              infants: 3,
            },
          },
        ],
        totalGuestsReviews: 26,
        totalHostsReviews: 1,
      },
      identityVerified: true,
      emailVerified: true,
    };
    (api.get as Mock).mockResolvedValueOnce({ data: testUser });
    const result = await fetchUsersById(id);
    expect(result).toEqual(testUser);
    expect(api.get).toHaveBeenCalledWith(`/public/users/${id}`);
  });

  it('should return null on error', async () => {
    const id = 99;
    (api.get as Mock).mockRejectedValueOnce(new Error('Not Found'));
    const result = await fetchUsersById(id);
    expect(result).toBeNull();
    expect(api.get).toHaveBeenCalledWith(`/public/users/${id}`);
  });
});

describe('fetchUserMe', () => {
  it('should return user on success', async () => {
    const testUser: UserMe = {
      id: 1700,
      firstName: 'Ramona',
      lastName: 'Simonis',
      preferredName: 'Josefa',
      email: 'Micah20@yahoo.com',
      identityVerified: true,
      phone: '(229) 571-3294',
      birthDate: '1977-07-11T20:01:32.476Z',
      address: '4584 E Broadway',
      profilePicture: {
        original:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.jpg',
        srcsetWebp:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1920w',
        srcsetAvif:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1920w',
      },
      city: 'North Elvera',
      state: 'Iowa',
      country: 'Cameroon',
      isRegisterCompleted: true,
      isSuperHost: true,
      isHost: true,
    };
    (api.get as Mock).mockResolvedValueOnce({ data: testUser });
    const result = await fetchUserMe();
    expect(result).toEqual(testUser);
    expect($userStore.set).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: testUser.firstName,
        profilePicture: testUser.profilePicture,
        email: testUser.email,
        identityVerified: testUser.identityVerified,
        isRegisterCompleted: testUser.isRegisterCompleted,
        isHost: testUser.isHost,
      })
    );
    expect(api.get).toHaveBeenCalledWith(`/users/me`);
  });
  it('should throw invalidTokenResponse on 401 Unauthorized', async () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 401,
        data: {},
      },
    };
    vi.mocked(api.get).mockRejectedValueOnce(error);

    try {
      await fetchUserMe();
      fail('Expected error was not thrown');
    } catch (err) {
      expect((err as Error).message).toBe('invalidTokenResponse');
    }
  });
  it('should throw networkError on other axios error without status', async () => {
    const error = {
      isAxiosError: true,
      response: undefined,
    };
    (api.get as Mock).mockRejectedValueOnce(error);
    await expect(fetchUserMe()).rejects.toThrow('networkError');
  });
});
