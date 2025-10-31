import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mock,
} from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useCreateListingPhotos,
  generateLocalPhotoData,
  generatePhotoOrder,
} from '@/components/React/Hooks/CreateListing/useCreateListingPhotos';
import type { ListingPhoto } from '@/types/createListing';
import * as api from '@/services/createListing';

vi.mock('@/services/createListing');

vi.mock('@/components/React/CreateListing/ToastContext', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));
vi.mock('@/utils/i18n', () => ({
  getTranslation: () => ({
    createListing: {
      toast: {
        errors: {
          fetchFailed: 'No se pudo obtener la información.',
          deleteFailed: 'No se pudo eliminar.',
          updateFailed: 'No se pudo actualizar la información.',
          saveFailed: 'No se pudieron guardar los cambios.',
        },
      },
    },
  }),
}));

const mocked = api as unknown as {
  getListingProgressData: Mock;
  deleteListingPhoto: Mock;
  updateListingPhoto: Mock;
  updateListingPhotosOrder: Mock;
  uploadSinglePhotoWithProgress: Mock;
};

const makePhoto = (id: number, order: number): ListingPhoto => ({
  id,
  original: '',
  srcsetWebp: '',
  srcsetAvif: '',
  caption: '',
  order,
});

const setGetPhotos = (...batches: ListingPhoto[][]) => {
  mocked.getListingProgressData.mockReset();
  if (batches.length === 0) {
    mocked.getListingProgressData.mockResolvedValue({ photos: [] });
    return;
  }
  batches.slice(0, -1).forEach((arr) => {
    mocked.getListingProgressData.mockResolvedValueOnce({ photos: arr });
  });
  mocked.getListingProgressData.mockResolvedValue({
    photos: batches[batches.length - 1],
  });
};

describe('useCreateListingPhotos - pure functions', () => {
  it('generateLocalPhotoData: creates correct structure and order', () => {
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = vi.fn((f: File) => `blob://${f.name}`);

    const files = [new File([], 'foo.jpg'), new File([], 'bar.png')];
    const newIds = [101, 102];
    const existingCount = 2;

    const res = generateLocalPhotoData(files, newIds, existingCount);
    expect(res).toHaveLength(2);
    expect(res[0]).toMatchObject({
      id: 101,
      original: 'blob://foo.jpg',
      caption: '',
      order: 3,
    });
    expect(res[1]).toMatchObject({
      id: 102,
      original: 'blob://bar.png',
      caption: '',
      order: 4,
    });

    URL.createObjectURL = originalCreateObjectURL;
  });

  it('generatePhotoOrder: maps to sequential id-order', () => {
    const photos = [makePhoto(5, 2), makePhoto(3, 1)];
    const res = generatePhotoOrder(photos);
    expect(res).toEqual([
      { id: 5, order: 1 },
      { id: 3, order: 2 },
    ]);
  });
});

describe('useCreateListingPhotos - hook workflow', () => {
  const updateFn = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    updateFn.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('hydrate via public method', () => {
    it('updates state with sorted photos from backend', async () => {
      mocked.updateListingPhoto.mockResolvedValueOnce(undefined);
      setGetPhotos(
        [makePhoto(2, 2), makePhoto(1, 1)],
        [makePhoto(1, 1), makePhoto(2, 2)]
      );

      const { result } = renderHook(() =>
        useCreateListingPhotos('list-1', [], updateFn)
      );

      await act(async () => {
        await result.current.updatePhotoCaption(1, 'x');
      });

      expect(updateFn).toHaveBeenCalledWith([makePhoto(1, 1), makePhoto(2, 2)]);
    });
  });

  describe('deletePhoto', () => {
    it('does nothing without listingId', async () => {
      const { result } = renderHook(() =>
        useCreateListingPhotos(undefined, [], updateFn)
      );

      await act(async () => {
        await result.current.deletePhoto(10);
      });

      expect(mocked.deleteListingPhoto).not.toHaveBeenCalled();
      expect(updateFn).not.toHaveBeenCalled();
    });

    it('deletes and skips PATCH when order did not change', async () => {
      mocked.deleteListingPhoto.mockResolvedValueOnce(undefined);

      const current = [makePhoto(1, 1), makePhoto(3, 2)];
      const { result } = renderHook(() =>
        useCreateListingPhotos('list-1', current, updateFn)
      );

      await act(async () => {
        await result.current.deletePhoto(3);
      });

      expect(mocked.deleteListingPhoto).toHaveBeenCalledWith('list-1', 3, {
        skipGlobal404Redirect: true,
      });
      expect(mocked.updateListingPhotosOrder).not.toHaveBeenCalled();
      expect(updateFn).toHaveBeenCalledWith([makePhoto(1, 1)]);
      expect(mocked.getListingProgressData).not.toHaveBeenCalled();
    });

    it('deletes and PATCHes when order changed', async () => {
      mocked.deleteListingPhoto.mockResolvedValueOnce(undefined);

      const current = [makePhoto(20, 2), makePhoto(10, 1)];
      const { result } = renderHook(() =>
        useCreateListingPhotos('list-1', current, updateFn)
      );

      await act(async () => {
        await result.current.deletePhoto(10);
      });

      expect(mocked.deleteListingPhoto).toHaveBeenCalledWith('list-1', 10, {
        skipGlobal404Redirect: true,
      });
      expect(mocked.updateListingPhotosOrder).toHaveBeenCalledWith(
        'list-1',
        [{ id: 20, order: 1 }],
        { skipGlobal404Redirect: true }
      );
      expect(updateFn).toHaveBeenCalledWith([makePhoto(20, 1)]);
      expect(mocked.getListingProgressData).not.toHaveBeenCalled();
    });
  });

  describe('updatePhotoCaption', () => {
    it('does nothing without listingId', async () => {
      const { result } = renderHook(() =>
        useCreateListingPhotos(undefined, [], updateFn)
      );

      await act(async () => {
        await result.current.updatePhotoCaption(1, 'hi');
      });

      expect(mocked.updateListingPhoto).not.toHaveBeenCalled();
      expect(updateFn).not.toHaveBeenCalled();
    });

    it('updates caption and hydrates', async () => {
      mocked.updateListingPhoto.mockResolvedValueOnce(undefined);
      setGetPhotos([makePhoto(1, 1)], [makePhoto(1, 1)]);

      const { result } = renderHook(() =>
        useCreateListingPhotos('list-1', [], updateFn)
      );

      await act(async () => {
        await result.current.updatePhotoCaption(1, 'hello');
      });

      expect(mocked.updateListingPhoto).toHaveBeenCalledWith(
        'list-1',
        1,
        { caption: 'hello' },
        { skipGlobal404Redirect: true }
      );
      expect(updateFn).toHaveBeenCalledWith([makePhoto(1, 1)]);
    });
  });

  describe('reorderPhotos', () => {
    it('skips PATCH if order is identical', async () => {
      setGetPhotos(
        [makePhoto(1, 1), makePhoto(2, 2)],
        [makePhoto(1, 1), makePhoto(2, 2)]
      );

      const current = [makePhoto(1, 1), makePhoto(2, 2)];
      const { result } = renderHook(() =>
        useCreateListingPhotos('list-1', current, updateFn)
      );

      await act(async () => {
        await result.current.reorderPhotos(current);
      });

      expect(mocked.updateListingPhotosOrder).not.toHaveBeenCalled();
      expect(updateFn).toHaveBeenCalled();
    });

    it('PATCHes when order changes', async () => {
      setGetPhotos(
        [makePhoto(1, 1), makePhoto(2, 2)],
        [makePhoto(1, 1), makePhoto(2, 2)]
      );

      const current = [makePhoto(1, 1), makePhoto(2, 2)];
      const rearranged = [makePhoto(2, 2), makePhoto(1, 1)];

      const { result } = renderHook(() =>
        useCreateListingPhotos('list-1', current, updateFn)
      );

      await act(async () => {
        await result.current.reorderPhotos(rearranged);
      });

      expect(mocked.updateListingPhotosOrder).toHaveBeenCalledWith(
        'list-1',
        [
          { id: 2, order: 1 },
          { id: 1, order: 2 },
        ],
        { skipGlobal404Redirect: true }
      );
      expect(updateFn).toHaveBeenCalled();
    });
  });

  describe('uploadPhotosWithProgress', () => {
    const originalCreateObjectURL = URL.createObjectURL;

    beforeEach(() => {
      URL.createObjectURL = vi.fn((f: File) => `blob://${f.name}`);
    });

    afterEach(() => {
      URL.createObjectURL = originalCreateObjectURL;
    });

    it('no-ops without listingId', async () => {
      const onProgress = vi.fn();
      const { result } = renderHook(() =>
        useCreateListingPhotos(undefined, [], updateFn)
      );

      await act(async () => {
        await result.current.uploadPhotosWithProgress(
          [new File([], 'a.jpg')],
          onProgress
        );
      });

      expect(mocked.uploadSinglePhotoWithProgress).not.toHaveBeenCalled();
      expect(mocked.updateListingPhotosOrder).not.toHaveBeenCalled();
      expect(updateFn).not.toHaveBeenCalled();
      expect(onProgress).not.toHaveBeenCalled();
    });

    it('uploads, reports progress, and skips PATCH when order unchanged', async () => {
      mocked.uploadSinglePhotoWithProgress.mockImplementationOnce(
        async (_id, _file, onProg: (n: number) => void) => {
          onProg(40);
          onProg(80);
          return 10;
        }
      );

      setGetPhotos(
        [makePhoto(1, 1), makePhoto(10, 2)],
        [makePhoto(1, 1), makePhoto(10, 2)]
      );

      const onProgress = vi.fn();
      const { result } = renderHook(() =>
        useCreateListingPhotos('list-1', [makePhoto(1, 1)], updateFn)
      );

      await act(async () => {
        await result.current.uploadPhotosWithProgress(
          [new File([], 'x.jpg')],
          onProgress
        );
      });

      expect(onProgress).toHaveBeenCalledWith(0, 0);
      expect(onProgress).toHaveBeenCalledWith(0, 40);
      expect(onProgress).toHaveBeenCalledWith(0, 80);
      expect(onProgress).toHaveBeenCalledWith(0, 100);
      expect(mocked.updateListingPhotosOrder).not.toHaveBeenCalled();
      expect(updateFn).toHaveBeenCalled();
    });

    it('uploads and PATCHes when appended order differs', async () => {
      mocked.uploadSinglePhotoWithProgress.mockResolvedValueOnce(20);

      setGetPhotos(
        [makePhoto(20, 1), makePhoto(1, 2)],
        [makePhoto(1, 1), makePhoto(20, 2)]
      );

      const onProgress = vi.fn();
      const { result } = renderHook(() =>
        useCreateListingPhotos('list-1', [makePhoto(1, 1)], updateFn)
      );

      await act(async () => {
        await result.current.uploadPhotosWithProgress(
          [new File([], 'y.jpg')],
          onProgress
        );
      });

      expect(mocked.updateListingPhotosOrder).toHaveBeenCalledWith(
        'list-1',
        [
          { id: 1, order: 1 },
          { id: 20, order: 2 },
        ],
        { skipGlobal404Redirect: true }
      );
      expect(updateFn).toHaveBeenCalled();
    });

    it('handles one failure: reports -1 and still hydrates', async () => {
      mocked.uploadSinglePhotoWithProgress
        .mockResolvedValueOnce(30)
        .mockRejectedValueOnce(new Error('fail'));

      setGetPhotos(
        [makePhoto(1, 1), makePhoto(30, 2)],
        [makePhoto(1, 1), makePhoto(30, 2)]
      );

      const onProgress = vi.fn();
      const { result } = renderHook(() =>
        useCreateListingPhotos('list-1', [makePhoto(1, 1)], updateFn)
      );

      await act(async () => {
        await result.current.uploadPhotosWithProgress(
          [new File([], 'ok.jpg'), new File([], 'bad.jpg')],
          onProgress
        );
      });

      expect(onProgress).toHaveBeenCalledWith(1, -1);
      expect(updateFn).toHaveBeenCalled();
    });
  });
});
