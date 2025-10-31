import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api';
import { registerDevice, removeDevice } from '@/services/devices';
import { DeviceType } from '@/types/device';

vi.mock('@/utils/api', () => {
  return {
    default: {
      post: vi.fn(),
      delete: vi.fn(),
    },
  };
});

vi.mock('axios', () => ({
  default: {
    isAxiosError: vi.fn(),
  },
  isAxiosError: vi.fn(),
}));

describe('registerDevice', () => {
  const mockDeviceData = {
    deviceToken: 'test-token-123',
    deviceType: DeviceType.Web,
    appVersion: '1.0.0',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register device successfully with authenticated endpoint', async () => {
    (api.post as Mock).mockResolvedValueOnce({ data: { success: true } });

    await expect(registerDevice(mockDeviceData)).resolves.not.toThrow();
    expect(api.post).toHaveBeenCalledWith('/devices/register', mockDeviceData);
  });

  it('should register device successfully with public endpoint', async () => {
    (api.post as Mock).mockResolvedValueOnce({ data: { success: true } });

    await expect(registerDevice(mockDeviceData, true)).resolves.not.toThrow();
    expect(api.post).toHaveBeenCalledWith(
      '/public/devices/register',
      mockDeviceData
    );
  });
});

describe('removeDevice', () => {
  const mockToken = 'test-token-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should remove device successfully', async () => {
    (api.delete as Mock).mockResolvedValueOnce({ data: { success: true } });

    await expect(removeDevice(mockToken)).resolves.not.toThrow();
    expect(api.delete).toHaveBeenCalledWith(`/devices/${mockToken}/remove`);
  });
});
