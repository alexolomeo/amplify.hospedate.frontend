import { useSearchInit } from '@/components/React/Hooks/Search/useSearchInit';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

describe('useSearchInit', () => {
  let mockLoadFromUrl = vi.fn();
  beforeEach(() => {
    mockLoadFromUrl = vi.fn();
  });

  it('should initialize with loading true and then set loading to false on success immediately', () => {
    const { result } = renderHook(() => useSearchInit(mockLoadFromUrl));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockLoadFromUrl).toHaveBeenCalledTimes(1);
  });

  it('should handle synchronous errors during loadFromUrl and set error state', () => {
    const errorMessage = 'Failed to initialize search. Please try again.';
    mockLoadFromUrl.mockImplementation(() => {
      throw new Error('Sync error from loadFromUrl');
    });
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { result } = renderHook(() => useSearchInit(mockLoadFromUrl));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(mockLoadFromUrl).toHaveBeenCalledTimes(1);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error initializing search:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  //  Ensure effect runs only once on mount (or when loadFromUrl changes if it were dynamic)
  it('should call loadFromUrl only once on mount', () => {
    const { unmount, rerender } = renderHook(() =>
      useSearchInit(mockLoadFromUrl)
    );
    expect(mockLoadFromUrl).toHaveBeenCalledTimes(1);
    // Re-render the hook (simulate parent re-rendering)
    rerender();
    // loadFromUrl should NOT be called again, as its dependency (mockLoadFromUrl) hasn't changed
    expect(mockLoadFromUrl).toHaveBeenCalledTimes(1);
    unmount();
    expect(mockLoadFromUrl).toHaveBeenCalledTimes(1);
  });

  it('should re-run the effect if loadFromUrl function reference changes', () => {
    const initialLoadFromUrl = vi.fn();
    const { rerender } = renderHook(({ fn }) => useSearchInit(fn), {
      initialProps: { fn: initialLoadFromUrl },
    });
    // Called once on initial mount
    expect(initialLoadFromUrl).toHaveBeenCalledTimes(1);
    const newLoadFromUrl = vi.fn();
    // Re-render with a *new reference* to the loadFromUrl function
    rerender({ fn: newLoadFromUrl });
    // The effect should re-run, causing newLoadFromUrl to be called
    expect(newLoadFromUrl).toHaveBeenCalledTimes(1);
    // The old one should not be called again if it's a new function
    expect(initialLoadFromUrl).toHaveBeenCalledTimes(1);
  });
});
