import { renderHook, act } from '@testing-library/react';
import { useEditListingOrchestrator } from '@/components/React/Hooks/Host/EditListing/useEditListingOrchestrator';
import type {
  SectionController,
  Unsubscribe,
  ValidationResult,
  PatchPayload,
} from '@/components/React/Utils/edit-listing/section-controller';
import type { Slug } from '@/components/React/Utils/edit-listing/slugs';
import type { NavOptions } from '@/components/React/Hooks/Host/EditListing/useEditListingOrchestrator';

jest.mock('@/services/host/edit-listing/editListing', () => ({
  updateEditListingValues: jest.fn(),
}));

import { updateEditListingValues } from '@/services/host/edit-listing/editListing';

type Watchers = {
  onDirty?: (d: boolean) => void;
  onValid?: (v: boolean) => void;
};

type ControllerBuildOptions = {
  initialDirty?: boolean;
  initialValid?: boolean;
  supportsFooterSave?: boolean;
  validateOk?: boolean;
  buildPatch?: PatchPayload;
};

function makeController(options?: ControllerBuildOptions): {
  ctrl: SectionController;
  watchers: Watchers;
  spies: {
    validate: jest.Mock<ValidationResult, []>;
    buildPatch: jest.Mock<PatchPayload, []>;
    discard: jest.Mock<void, []>;
  };
} {
  const watchers: Watchers = {};

  const validateOk: boolean = options?.validateOk ?? true;
  const validate = jest.fn<ValidationResult, []>(() =>
    validateOk ? { ok: true } : { ok: false, errors: {} }
  );

  const defaultPatch: PatchPayload = {
    yourPlace: { someSection: { field: 'value' } },
  } as unknown as PatchPayload;
  const buildPatch = jest.fn<PatchPayload, []>(
    () => options?.buildPatch ?? defaultPatch
  );
  const discard = jest.fn<void, []>(() => {});

  const ctrl: SectionController = {
    getSlug: () => 'price',
    isDirty: () => Boolean(options?.initialDirty),
    validate,
    buildPatch,
    discard,
    applyServerErrors: () => {},
    supportsFooterSave: () => options?.supportsFooterSave ?? true,
    watchDirty: (cb: (dirty: boolean) => void): Unsubscribe => {
      watchers.onDirty = cb;
      cb(Boolean(options?.initialDirty));
      return () => {
        watchers.onDirty = undefined;
      };
    },
    watchValidity: (cb: (valid: boolean) => void): Unsubscribe => {
      watchers.onValid = cb;
      cb(Boolean(options?.initialValid));
      return () => {
        watchers.onValid = undefined;
      };
    },
  };

  return { ctrl, watchers, spies: { validate, buildPatch, discard } };
}

function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('useEditListingOrchestrator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const listingId = 'listing-123';

  const refresh = jest.fn<Promise<void>, []>(async () => {});
  const navigateTo = jest.fn<void, [Slug, NavOptions | undefined]>(() => {});
  const applyRoute = jest.fn<void, [Slug, string]>(() => {});

  const confirmDiscardTrue = jest.fn<boolean | Promise<boolean>, []>(
    () => true
  );
  const confirmDiscardFalse = jest.fn<boolean | Promise<boolean>, []>(
    () => false
  );

  it('registers a controller and derives canSave from dirty/valid/watchers; ignores when supportsFooterSave=false', () => {
    const { result } = renderHook(() =>
      useEditListingOrchestrator({
        listingId,
        refresh,
        navigateTo,
        applyRoute,
        confirmDiscard: confirmDiscardTrue,
        isReadOnly: false,
      })
    );

    const { ctrl, watchers } = makeController({
      initialDirty: false,
      initialValid: true,
      supportsFooterSave: true,
    });

    let cleanup: (() => void) | null = null;
    act(() => {
      cleanup = result.current.registerController(ctrl);
    });

    expect(result.current.canSave).toBe(false);

    act(() => {
      watchers.onDirty?.(true);
      watchers.onValid?.(true);
    });
    expect(result.current.canSave).toBe(true);

    act(() => {
      watchers.onValid?.(false);
    });
    expect(result.current.canSave).toBe(false);

    const { ctrl: ctrl2, watchers: w2 } = makeController({
      initialDirty: false,
      initialValid: true,
      supportsFooterSave: false,
    });

    act(() => {
      cleanup?.();
      result.current.registerController(ctrl2);
    });
    expect(result.current.canSave).toBe(false);

    act(() => {
      w2.onDirty?.(true);
      w2.onValid?.(true);
    });
    expect(result.current.canSave).toBe(false);
  });

  it('saveCurrent: validates, posts patch, refreshes, discards, ends with canSave=false', async () => {
    (updateEditListingValues as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() =>
      useEditListingOrchestrator({
        listingId,
        refresh,
        navigateTo,
        applyRoute,
        confirmDiscard: confirmDiscardTrue,
        isReadOnly: false,
      })
    );

    const patch: PatchPayload = {
      yourPlace: {
        pricesSection: {
          perNight: { price: 500 },
          perWeekend: { price: null },
          discounts: { weekly: null, monthly: null },
        },
      },
    } as PatchPayload;

    const { ctrl, watchers, spies } = makeController({
      initialDirty: true,
      initialValid: true,
      validateOk: true,
      buildPatch: patch,
    });

    act(() => {
      result.current.registerController(ctrl);
      watchers.onDirty?.(true);
      watchers.onValid?.(true);
    });
    expect(result.current.canSave).toBe(true);

    let res: 'ok' | 'error' = 'error';
    await act(async () => {
      res = await result.current.saveCurrent();
      await flushPromises();
    });

    expect(res).toBe('ok');
    expect(spies.validate).toHaveBeenCalledTimes(2);
    expect(updateEditListingValues).toHaveBeenCalledWith(listingId, patch);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(spies.discard).toHaveBeenCalledTimes(1);
    expect(result.current.canSave).toBe(false);
  });

  it('saveCurrent: when validate() fails, does not call the service and returns "error"', async () => {
    const { result } = renderHook(() =>
      useEditListingOrchestrator({
        listingId,
        refresh,
        navigateTo,
        applyRoute,
        confirmDiscard: confirmDiscardTrue,
        isReadOnly: false,
      })
    );

    const { ctrl, watchers, spies } = makeController({
      initialDirty: true,
      initialValid: false,
      validateOk: false,
    });

    act(() => {
      result.current.registerController(ctrl);
      watchers.onDirty?.(true);
      watchers.onValid?.(false);
    });

    let res: 'ok' | 'error' = 'ok';
    await act(async () => {
      res = await result.current.saveCurrent();
      await flushPromises();
    });

    expect(res).toBe('error');
    expect(spies.validate).toHaveBeenCalledTimes(2);
    expect(updateEditListingValues).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
    expect(spies.discard).not.toHaveBeenCalled();
    expect(result.current.canSave).toBe(false);
  });

  it('guardAndNavigate: confirms on dirty; with confirm=true it discards and navigates, with confirm=false it does not navigate', async () => {
    const { result: r1 } = renderHook(() =>
      useEditListingOrchestrator({
        listingId,
        refresh,
        navigateTo,
        applyRoute,
        confirmDiscard: confirmDiscardTrue,
        isReadOnly: false,
      })
    );

    const {
      ctrl: c1,
      watchers: w1,
      spies: s1,
    } = makeController({
      initialDirty: true,
      initialValid: true,
    });

    act(() => {
      r1.current.registerController(c1);
      w1.onDirty?.(true);
      w1.onValid?.(true);
    });

    await act(async () => {
      await r1.current.guardAndNavigate('title');
    });

    expect(s1.discard).toHaveBeenCalledTimes(1);
    expect(navigateTo).toHaveBeenCalledWith('title', undefined);

    navigateTo.mockClear();

    const { result: r2 } = renderHook(() =>
      useEditListingOrchestrator({
        listingId,
        refresh,
        navigateTo,
        applyRoute,
        confirmDiscard: confirmDiscardFalse,
        isReadOnly: false,
      })
    );

    const {
      ctrl: c2,
      watchers: w2,
      spies: s2,
    } = makeController({
      initialDirty: true,
      initialValid: true,
    });

    act(() => {
      r2.current.registerController(c2);
      w2.onDirty?.(true);
      w2.onValid?.(true);
    });

    await act(async () => {
      await r2.current.guardAndNavigate('price');
    });

    expect(s2.discard).not.toHaveBeenCalled();
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it('always keeps canSave=false when readOnly=true', () => {
    const { result } = renderHook(() =>
      useEditListingOrchestrator({
        listingId,
        refresh,
        navigateTo,
        applyRoute,
        confirmDiscard: confirmDiscardTrue,
        isReadOnly: true,
      })
    );

    const { ctrl, watchers } = makeController({
      initialDirty: true,
      initialValid: true,
    });

    act(() => {
      result.current.registerController(ctrl);
      watchers.onDirty?.(true);
      watchers.onValid?.(true);
    });

    expect(result.current.canSave).toBe(false);
  });
});
