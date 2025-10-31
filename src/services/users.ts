import type { GuestTripsResponse } from '@/types/trips';
import type { TripDetail } from '@/types/tripDetail';
import { ValidationError } from '@/errors/CustomErrors';
import { $userStore } from '@/stores/userStore';
import type { CompleteRegister } from '@/types/auth';
import type { LoginInfo, User, UserMe, UserStore } from '@/types/user';
import api from '@/utils/api';
import axios from 'axios';
import { optionalArg } from '@/utils/http.ts';

export const fetchUsersById = async (id: number): Promise<User | null> => {
  try {
    const response = await api.get<User>(`/public/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user with id ${id}`, error);
    return null;
  }
};

export const fetchUserMe = async (): Promise<UserMe> => {
  try {
    const response = await api.get<UserMe>(`/users/me`);
    const data: UserStore = {
      id: response.data.id,
      firstName: response.data.firstName,
      profilePicture: response.data.profilePicture,
      email: response.data.email,
      identityVerified: response.data.identityVerified,
      isRegisterCompleted: response.data.isRegisterCompleted,
      isHost: response.data.isHost,
    };
    $userStore.set(data);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user me`, error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) throw new Error('invalidTokenResponse');
    }
    throw new Error('networkError');
  }
};

export const getLoginInfo = async (): Promise<LoginInfo> => {
  try {
    const response = await api.get<LoginInfo>(`/account-settings/login-info`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user me`, error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) throw new Error('invalidTokenResponse');
    }
    throw new Error('networkError');
  }
};

export const getUserMe = async (cookie?: string): Promise<UserMe> => {
  try {
    const apiUrl = `${import.meta.env.PUBLIC_API_URL}/users/me`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (cookie) {
      headers['Cookie'] = cookie;
    }

    const response = await axios.get<UserMe>(apiUrl, {
      headers,
      timeout: 8000,
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in getUserMe:', error.message);
    } else {
      console.error('Error in getUserMe:', error);
    }
    throw error;
  }
};

export const completeRegister = async (data: CompleteRegister) => {
  try {
    await api.patch('/users/complete-register', data);
  } catch (error) {
    console.error(`Failed to register with`, error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400 && error.response?.data?.extra?.fields) {
        throw new ValidationError(error.response.data.extra.fields);
      }
    }
    throw new Error('networkError');
  }
};

export const getGuestTrips = async (): Promise<GuestTripsResponse> => {
  try {
    const response = await api.get<GuestTripsResponse>('/guests/trips');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch guest trips', error);
    throw new Error('networkError');
  }
};

export const getTripDetail = async (
  tripId: string,
  opts?: { skipGlobal404Redirect?: boolean }
): Promise<TripDetail> => {
  try {
    const { data } = await api.get<TripDetail>(
      `/users/trips/${tripId}`,
      ...optionalArg(opts?.skipGlobal404Redirect, {
        skipGlobal404Redirect: true,
      })
    );
    return data;
  } catch (error) {
    console.error(`Failed to fetch trip detail for id ${tripId}`, error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) throw new Error('Trip not found');
      throw error;
    }
    throw new Error('networkError');
  }
};
