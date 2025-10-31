import api from '@/utils/api';
import axios from 'axios';
import { ValidationError } from '@/errors/CustomErrors';
import type { RegisterDevice } from '@/types/device';

export const registerDevice = async (
  data: RegisterDevice,
  publicPath: boolean = false
) => {
  try {
    const path = publicPath ? '/public/devices/register' : '/devices/register';
    await api.post(path, data);
  } catch (error) {
    console.error(`Failed to register device with`, error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400 && error.response?.data?.extra?.fields) {
        throw new ValidationError(error.response.data.extra.fields);
      }
      if (status === 400) throw new Error('badRequest');
    }
    throw new Error('networkError');
  }
};

export const removeDevice = async (token: string) => {
  try {
    await api.delete(`/devices/${token}/remove`);
  } catch (error) {
    console.error(`Failed to remove device with`, error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) throw new Error('notFound');
      if (status === 400) throw new Error('badRequest');
    }
    throw new Error('networkError');
  }
};
