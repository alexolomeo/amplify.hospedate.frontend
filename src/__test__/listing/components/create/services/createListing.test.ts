import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api';
import {
  getListingCreationData,
  getListingProgressData,
  createListing,
  updateListingStep,
  updateListingPhoto,
  updateListingPhotosOrder,
  deleteListingPhoto,
  uploadSinglePhotoWithProgress,
  finalizeListingCreation,
} from '@/services/createListing';
import type {
  ListingCreationData,
  ListingProgressData,
  CreateListingInput,
  UpdateListingStepData,
  UpdatePhoto,
  UpdatePhotoOrder,
} from '@/types/createListing';

vi.mock('@/utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('createListing services', () => {
  describe('getListingCreationData', () => {
    it('should return data on success', async () => {
      const mockData: ListingCreationData = {
        amenities: [],
        placeTypes: [],
      };

      (api.get as Mock).mockResolvedValueOnce({ data: mockData });

      const result = await getListingCreationData();
      expect(result).toEqual(mockData);
      expect(api.get).toHaveBeenCalledWith('/listings/create');
    });

    it('should throw an error on failure', async () => {
      (api.get as Mock).mockRejectedValueOnce(new Error('Network error'));
      await expect(getListingCreationData()).rejects.toThrow('Network error');
    });
  });

  describe('getListingProgressData', () => {
    it('should return progress data on success', async () => {
      const mockData: ListingProgressData = {
        placeTypeId: 1,
        guestNumber: 2,
        roomNumber: 1,
        bedNumber: 1,
        bathNumber: 1,
        showSpecificLocation: false,
        location: {
          address: '123 St',
          city: 'Santa Cruz',
          state: 'SC',
          country: 'Bolivia',
          coordinates: { latitude: -17.78, longitude: -63.18 },
        },
        amenities: [],
        photos: [],
        title: 'Test',
        description: 'Desc',
        nightlyPrice: 100,
        discount: { weeklyDiscount: 0, monthlyDiscount: 0 },
        currentStep: 3,
        currentSubStep: 2,
      };

      (api.get as Mock).mockResolvedValueOnce({ data: mockData });

      const result = await getListingProgressData('1');
      expect(result).toEqual(mockData);
      expect(api.get).toHaveBeenCalledWith('/listings/create/1', {
        skipGlobal404Redirect: true,
      });
    });

    it('should throw on failure', async () => {
      (api.get as Mock).mockRejectedValueOnce(new Error('Error'));
      await expect(getListingProgressData('1')).rejects.toThrow('Error');
    });
  });

  describe('createListing', () => {
    it('should return listingId on success', async () => {
      const input: CreateListingInput = { placeTypeId: 1 };
      (api.post as Mock).mockResolvedValueOnce({
        data: { listingId: '1' },
      });

      const result = await createListing(input);
      expect(result).toBe('1');
      expect(api.post).toHaveBeenCalledWith('/listings/create', input);
    });

    it('should throw if listingId is missing', async () => {
      (api.post as Mock).mockResolvedValueOnce({ data: {} });
      await expect(createListing({ placeTypeId: 1 })).rejects.toThrow(
        'The response does not contain a valid listingId'
      );
    });
  });

  describe('updateListingStep', () => {
    it('should call patch with correct args', async () => {
      (api.patch as Mock).mockResolvedValueOnce({});
      const payload: UpdateListingStepData = {
        placeTypeId: 1,
        showSpecificLocation: false,
        location: {
          address: '123 St',
          city: 'Santa Cruz',
          state: 'SC',
          country: 'Bolivia',
          coordinates: { latitude: -17.78, longitude: -63.18 },
        },
      };

      await updateListingStep('1', '1-4', payload);
      expect(api.patch).toHaveBeenCalledWith(
        '/listings/1/create/step/1-4',
        payload,
        { skipGlobal404Redirect: true }
      );
    });

    it('should throw on error', async () => {
      (api.patch as Mock).mockRejectedValueOnce(new Error('Update failed'));
      await expect(
        updateListingStep('1', '1-4', {} as UpdateListingStepData)
      ).rejects.toThrow('Update failed');
    });
  });

  describe('updateListingPhoto', () => {
    it('should resolve and include headers + skip flag', async () => {
      (api.patch as Mock).mockResolvedValueOnce({ status: 204 });

      const data: UpdatePhoto = { caption: 'New caption' };

      await expect(updateListingPhoto('1', 1, data)).resolves.toBeUndefined();

      expect(api.patch).toHaveBeenCalledWith('/listings/1/photos/1', data, {
        headers: { 'Content-Type': 'application/json' },
        skipGlobal404Redirect: true,
      });
    });

    it('does not validate status: resolves even if status != 204', async () => {
      (api.patch as Mock).mockResolvedValueOnce({ status: 200 });
      await expect(
        updateListingPhoto('1', 1, { caption: 'New caption' })
      ).resolves.toBeUndefined();
    });
  });

  describe('updateListingPhotosOrder', () => {
    it('should resolve and include headers + skip flag', async () => {
      (api.patch as Mock).mockResolvedValueOnce({ status: 204 });

      const data: UpdatePhotoOrder[] = [
        { id: 1, order: 1 },
        { id: 2, order: 2 },
      ];

      await expect(
        updateListingPhotosOrder('1', data)
      ).resolves.toBeUndefined();

      expect(api.patch).toHaveBeenCalledWith('/listings/1/photos/order', data, {
        headers: { 'Content-Type': 'application/json' },
        skipGlobal404Redirect: true,
      });
    });

    it('does not validate status: resolves even if status != 204', async () => {
      (api.patch as Mock).mockResolvedValueOnce({ status: 400 });
      const data: UpdatePhotoOrder[] = [{ id: 1, order: 1 }];
      await expect(
        updateListingPhotosOrder('1', data)
      ).resolves.toBeUndefined();
    });
  });

  describe('deleteListingPhoto', () => {
    it('should resolve and include skip flag', async () => {
      (api.delete as Mock).mockResolvedValueOnce({ status: 204 });
      await expect(deleteListingPhoto('1', 1)).resolves.toBeUndefined();
      expect(api.delete).toHaveBeenCalledWith('/listings/1/photos/1', {
        skipGlobal404Redirect: true,
      });
    });

    it('does not validate status: resolves even if status != 204', async () => {
      (api.delete as Mock).mockResolvedValueOnce({ status: 404 });
      await expect(deleteListingPhoto('1', 1)).resolves.toBeUndefined();
    });
  });

  describe('uploadSinglePhotoWithProgress', () => {
    it('should return photo ID on success and call progress', async () => {
      const mockFile = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
      const mockProgress = vi.fn();

      (api.post as Mock).mockResolvedValueOnce({
        status: 201,
        data: { id: 321 },
      });

      const result = await uploadSinglePhotoWithProgress(
        'listing123',
        mockFile,
        mockProgress
      );
      expect(result).toBe(321);
      expect(api.post).toHaveBeenCalledWith(
        '/listings/listing123/photos',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: expect.any(Function),
          skipGlobal404Redirect: true,
        })
      );
    });

    it('should throw if no id returned', async () => {
      const mockFile = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
      (api.post as Mock).mockResolvedValueOnce({ status: 201, data: {} });
      await expect(
        uploadSinglePhotoWithProgress('listing123', mockFile, () => {})
      ).rejects.toThrow(
        '[uploadSinglePhotoWithProgress] The response does not contain a valid ID'
      );
    });

    it('should throw on API error', async () => {
      const mockFile = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
      (api.post as Mock).mockRejectedValueOnce(new Error('Upload failed'));
      await expect(
        uploadSinglePhotoWithProgress('listing123', mockFile, () => {})
      ).rejects.toThrow('Upload failed');
    });
  });

  describe('finalizeListingCreation', () => {
    it('should succeed when API returns 204 and include skip flag', async () => {
      (api.patch as Mock).mockResolvedValueOnce({ status: 204 });

      await expect(
        finalizeListingCreation('listing123')
      ).resolves.toBeUndefined();
      expect(api.patch).toHaveBeenCalledWith(
        '/listings/listing123/create/finish',
        undefined,
        { skipGlobal404Redirect: true }
      );
    });

    it('should throw an error if API returns non-204', async () => {
      (api.patch as Mock).mockResolvedValueOnce({ status: 200 });

      await expect(finalizeListingCreation('listing123')).rejects.toThrow(
        'Finalize listing returned unexpected status 200'
      );
    });

    it('should throw on API error', async () => {
      (api.patch as Mock).mockRejectedValueOnce(new Error('Server error'));

      await expect(finalizeListingCreation('listing123')).rejects.toThrow(
        'Server error'
      );
    });
  });
});
