import { render, screen, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { useEditListing } from '@/components/React/Hooks/Host/EditListing/useEditListing';
import type { EditListingCatalog } from '@/types/host/edit-listing/editListingCatalog';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';

jest.mock('@nanostores/react', () => ({
  useStore: jest.fn(),
}));

jest.mock('@/stores/host/editListing/editListingSession', () => ({
  $editListingSession: {},
  getSession: jest.fn(),
  setSession: jest.fn(),
  setListingValues: jest.fn(),
  removeListingValuesAndMaybeCleanup: jest.fn(),
}));

jest.mock('@/services/host/edit-listing/editListing', () => ({
  fetchEditListingCatalogs: jest.fn(),
  fetchEditListingValues: jest.fn(),
}));

jest.mock('@/utils/i18n', () => ({
  getTranslation: jest.fn(() => ({
    hostContent: {
      editListing: {
        commonMessages: {
          failedFetch: 'Failed to fetch',
        },
      },
    },
  })),
}));

import { useStore } from '@nanostores/react';
import {
  getSession,
  setSession,
  setListingValues,
  removeListingValuesAndMaybeCleanup,
} from '@/stores/host/editListing/editListingSession';
import {
  fetchEditListingCatalogs,
  fetchEditListingValues,
} from '@/services/host/edit-listing/editListing';

function Harness({ listingId }: { listingId: string }) {
  const { status, error, selectors, values, refresh } = useEditListing(
    listingId,
    'es'
  );
  return (
    <div>
      <div data-testid="status">{status}</div>
      {error && <div data-testid="error">{error}</div>}
      <div data-testid="selectors-amenities">
        {selectors.amenityGroups.length}
      </div>
      <div data-testid="has-values">{values ? 'yes' : 'no'}</div>
      <button onClick={() => void refresh()} data-testid="refresh-btn">
        refresh
      </button>
    </div>
  );
}

describe('useEditListing (Jest)', () => {
  const baseSession = {
    catalogs: undefined as EditListingCatalog | undefined,
    listingDraft: undefined as undefined | { listingId?: string },
    valuesByListingId: {} as Record<
      string,
      {
        workingValues?: ListingEditorValues;
        serverValues?: ListingEditorValues;
      }
    >,
  };

  const catalogsMock: EditListingCatalog = {
    amenitiesSection: { amenityGroups: [] },
    availabilitySection: {
      advanceNoticeHours: [{ id: 1, name: '24h' }],
      sameDayAdvanceNoticeTimes: [{ id: 10, name: '10:00' }],
    },
    houseRulesSection: {
      checkInOut: {
        checkInStartTimes: [{ id: 12, name: '12 p.m.' }],
        checkInEndTimes: [{ id: 22, name: '10 p.m.' }],
        checkoutTimes: [{ id: 11, name: '11 a.m.' }],
      },
      quietHours: {
        startTimes: [{ id: 21, name: '9 p.m.' }],
        endTimes: [{ id: 8, name: '8 a.m.' }],
      },
    },
    propertyTypeSection: {
      propertyTypeGroups: [],
      propertySizeUnits: [{ id: 'M2', name: 'm²' }],
    },
  };

  const valuesMock: ListingEditorValues = {
    yourPlace: { titleSection: { listingTitle: 'Mi título' } },
    setting: { statusSection: { status: 'UNLISTED' } },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as jest.Mock).mockReturnValue({ ...baseSession });
    (getSession as jest.Mock).mockReturnValue({ ...baseSession });
    (fetchEditListingCatalogs as jest.Mock).mockResolvedValue(catalogsMock);
    (fetchEditListingValues as jest.Mock).mockResolvedValue(valuesMock);
  });

  afterEach(() => {
    cleanup();
  });

  it('loads catalogs and values on mount and sets status=ready', async () => {
    render(<Harness listingId="L1" />);

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('ready')
    );

    expect(setSession).toHaveBeenCalledWith(
      expect.objectContaining({ catalogs: catalogsMock })
    );
    expect(setListingValues).toHaveBeenCalledWith('L1', valuesMock);
  });

  it('if any of the loads fail, sets status=error and shows message', async () => {
    (fetchEditListingValues as jest.Mock).mockResolvedValue(null);

    render(<Harness listingId="L2" />);

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('error')
    );
    expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch');

    expect(setSession).not.toHaveBeenCalled();
    expect(setListingValues).not.toHaveBeenCalled();
  });

  it('if catalogs and workingValues are already in the store, does not fetch and stays ready', async () => {
    const cachedSession = {
      ...baseSession,
      catalogs: catalogsMock,
      valuesByListingId: {
        L3: { workingValues: valuesMock, serverValues: valuesMock },
      },
    };
    (useStore as jest.Mock).mockReturnValue(cachedSession);

    render(<Harness listingId="L3" />);

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('ready')
    );

    expect(fetchEditListingCatalogs).not.toHaveBeenCalled();
    expect(fetchEditListingValues).not.toHaveBeenCalled();
  });

  it('refresh triggers the load again', async () => {
    render(<Harness listingId="L4" />);

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('ready')
    );

    const beforeCalls = (fetchEditListingValues as jest.Mock).mock.calls.length;

    screen.getByTestId('refresh-btn').click();

    await waitFor(() =>
      expect(
        (fetchEditListingValues as jest.Mock).mock.calls.length
      ).toBeGreaterThan(beforeCalls)
    );

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('ready')
    );
  });

  it('calls removeListingValuesAndMaybeCleanup on unmount', async () => {
    const { unmount } = render(<Harness listingId="L5" />);

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('ready')
    );

    unmount();

    expect(removeListingValuesAndMaybeCleanup).toHaveBeenCalledWith('L5');
  });
});
