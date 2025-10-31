import type { User } from '@/types/user';
import api from '@/utils/api.ts';

export interface UserInfoValues {
  show_birth_decade: boolean;
  work: string;
  travel_dream: string;
  pets: string;
  school: string;
  fun_fact: string;
  useless_skill: string;
  wasted_time: string;
  favorite_song: string;
  biography_title: string;
  obsession: string;
  about: string;
  languages: number[];
}

export interface UpdateUserInfo {
  info?: UserInfoValues;
  interests?: number[];
}

export const getProfileInfo = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<User>('/users/profile/retrieve');
    return data;
  } catch (error) {
    console.error('Failed to fetch User Profile Info', error);
    return null;
  }
};

export const updateProfileInfo = async (
  payload: UpdateUserInfo
): Promise<void> => {
  try {
    await api.put('/users/profile-info', payload);
  } catch (error) {
    console.error('Failed to update User Profile Info', error);
    throw new Error('Failed to update User Profile Info');
  }
};

export const updateProfilePhoto = async (photo: File): Promise<void> => {
  const form = new FormData();
  form.append('photo', photo);
  try {
    await api.put('/users/profile-photo', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Failed to update User Profile Photo', error);
    throw new Error('Failed to update User Profile Photo');
  }
};
