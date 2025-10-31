import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api';
import type { AxiosProgressEvent } from 'axios';
import {
  fetchPhotosFromSpace,
  uploadSpacePhotoWithProgress,
  patchListingPhotoCaption,
  deleteListingPhoto,
} from '@/services/host/edit-listing/gallery';

vi.mock('@/utils/api', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe('gallery services', () => {
  describe('fetchPhotosFromSpace', () => {
    it('maps response correctly on success', async () => {
      (api.get as Mock).mockResolvedValueOnce({
        data: [
          {
            id: 10,
            media: {
              original: 'orig.jpg',
              srcsetWebp: 'webp 480w',
              srcsetAvif: 'avif 480w',
            },
            caption: 'hola',
          },
          {
            id: 11,
            media: { original: 'o2.jpg', srcsetWebp: '', srcsetAvif: '' },
          },
        ],
      });

      const result = await fetchPhotosFromSpace('1', '2');

      expect(result).toEqual([
        {
          id: 10,
          photo: {
            original: 'orig.jpg',
            srcsetWebp: 'webp 480w',
            srcsetAvif: 'avif 480w',
          },
          caption: 'hola',
        },
        {
          id: 11,
          photo: {
            original: 'o2.jpg',
            srcsetWebp: '',
            srcsetAvif: '',
          },
          caption: '',
        },
      ]);
      expect(api.get).toHaveBeenCalledWith('/listings/1/spaces/2/photos');
    });

    it('uses encodeURIComponent for IDs', async () => {
      (api.get as Mock).mockResolvedValueOnce({ data: [] });
      await fetchPhotosFromSpace('id con espacio', 'sp/ace');
      expect(api.get).toHaveBeenCalledWith(
        '/listings/id%20con%20espacio/spaces/sp%2Face/photos'
      );
    });

    it('returns empty array and logs error on failure', async () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (api.get as Mock).mockRejectedValueOnce(new Error('boom'));

      const res = await fetchPhotosFromSpace('1', '2');
      expect(res).toEqual([]);
      expect(spy).toHaveBeenCalledWith(
        'Failed to fetch available photos',
        expect.any(Error)
      );
      spy.mockRestore();
    });

    it('tolerates non-array data and returns empty array', async () => {
      (api.get as Mock).mockResolvedValueOnce({ data: { not: 'array' } });
      const res = await fetchPhotosFromSpace('1', '2');
      expect(res).toEqual([]);
    });
  });

  describe('uploadSpacePhotoWithProgress', () => {
    it('uploads file, emits progress, and returns id on 200/201', async () => {
      const onProgress = vi.fn();

      // simulamos post llamando al onUploadProgress y retornando respuesta OK
      (api.post as Mock).mockImplementationOnce(
        async (
          _url: string,
          _body: FormData,
          config: { onUploadProgress?: (e: AxiosProgressEvent) => void }
        ) => {
          // simulamos un progreso parcial
          config.onUploadProgress?.({
            loaded: 50,
            total: 100,
          } as AxiosProgressEvent);
          // respuesta final
          return { status: 201, data: { id: 999 } };
        }
      );

      const file = new File([new Uint8Array([1, 2, 3])], 'photo.jpg', {
        type: 'image/jpeg',
      });
      const id = await uploadSpacePhotoWithProgress('L1', 7, file, onProgress);

      // URL con encoding correcto
      expect(api.post).toHaveBeenCalled();
      const [calledUrl, formDataArg, options] = (api.post as Mock).mock
        .calls[0];
      expect(calledUrl).toBe('/listings/L1/spaces/7/photos');

      // el body es FormData con key 'photo'
      expect(formDataArg instanceof FormData).toBe(true);
      expect((formDataArg as FormData).get('photo')).toBe(file);

      // headers y onUploadProgress configurados
      expect(options.headers['Content-Type']).toBe('multipart/form-data');
      expect(typeof options.onUploadProgress).toBe('function');

      // progreso emitido por el mock + cierre al 100%
      expect(onProgress).toHaveBeenCalledWith(50);
      expect(onProgress).toHaveBeenLastCalledWith(100);

      expect(id).toBe(999);
    });

    it('throws if status is not 200/201 or id is not numeric', async () => {
      (api.post as Mock).mockResolvedValueOnce({
        status: 200,
        data: { id: 'x' },
      });
      await expect(
        uploadSpacePhotoWithProgress('L1', 2, new File([], 'a.jpg'))
      ).rejects.toThrow('[uploadSpacePhotoWithProgress] Unexpected response');

      (api.post as Mock).mockResolvedValueOnce({
        status: 400,
        data: { id: 1 },
      });
      await expect(
        uploadSpacePhotoWithProgress('L1', 2, new File([], 'a.jpg'))
      ).rejects.toThrow('[uploadSpacePhotoWithProgress] Unexpected response');
    });

    it('logs error and rethrows when POST fails', async () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (api.post as Mock).mockRejectedValueOnce(new Error('network'));

      await expect(
        uploadSpacePhotoWithProgress('L1', 2, new File([], 'a.jpg'))
      ).rejects.toThrow('network');

      expect(spy).toHaveBeenCalledWith(
        '[uploadSpacePhotoWithProgress] Upload failed:',
        expect.any(Error)
      );
      spy.mockRestore();
    });
  });

  describe('patchListingPhotoCaption', () => {
    it('accepts 204 and 200 as success', async () => {
      (api.patch as Mock).mockResolvedValueOnce({ status: 204 });
      await expect(
        patchListingPhotoCaption('L1', 5, 'hola')
      ).resolves.toBeUndefined();
      expect(api.patch).toHaveBeenCalledWith('/listings/L1/photos/5', {
        caption: 'hola',
      });

      (api.patch as Mock).mockResolvedValueOnce({ status: 200 });
      await expect(
        patchListingPhotoCaption('L1', '6', 'mundo')
      ).resolves.toBeUndefined();
      expect(api.patch).toHaveBeenCalledWith('/listings/L1/photos/6', {
        caption: 'mundo',
      });
    });

    it('uses encodeURIComponent for IDs and throws on unexpected status', async () => {
      (api.patch as Mock).mockResolvedValueOnce({ status: 418 }); // I’m a teapot 😅
      await expect(
        patchListingPhotoCaption('id con espacio', 'ph/oto', 'x')
      ).rejects.toThrow('[patchListingPhotoCaption] Unexpected status=418');

      expect(api.patch).toHaveBeenCalledWith(
        '/listings/id%20con%20espacio/photos/ph%2Foto',
        { caption: 'x' }
      );
    });
  });

  describe('deleteListingPhoto', () => {
    it('accepts 204 and 200 as success', async () => {
      (api.delete as Mock).mockResolvedValueOnce({ status: 204 });
      await expect(deleteListingPhoto('L1', 10)).resolves.toBeUndefined();
      expect(api.delete).toHaveBeenCalledWith('/listings/L1/photos/10');

      (api.delete as Mock).mockResolvedValueOnce({ status: 200 });
      await expect(deleteListingPhoto('L1', '11')).resolves.toBeUndefined();
      expect(api.delete).toHaveBeenCalledWith('/listings/L1/photos/11');
    });

    it('uses encodeURIComponent for IDs and throws on unexpected status', async () => {
      (api.delete as Mock).mockResolvedValueOnce({ status: 500 });
      await expect(
        deleteListingPhoto('id con espacio', 'ph/oto')
      ).rejects.toThrow('[deleteListingPhoto] Unexpected status=500');

      expect(api.delete).toHaveBeenCalledWith(
        '/listings/id%20con%20espacio/photos/ph%2Foto'
      );
    });
  });
});
