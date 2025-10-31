import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';

import EditBookingConfiguration from '@/components/React/Host/EditListing/Content/YourPlace/EditBookingConfiguration';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';

jest.mock('@/components/React/Host/EditListing/EditabilityContext', () => ({
  useEditability: jest.fn(() => ({ isReadOnly: false })),
}));

jest.mock('@/utils/i18n', () => ({
  getTranslation: jest.fn(() => ({
    hostContent: {
      editListing: {
        content: {
          booking: {
            title: 'Booking configuration',
            instantBooking: 'Instant booking',
            instantBookingDescription: 'Guests book without approval.',
            approveAllReservations: 'Approval required',
            approveAllReservationsDescription: 'You review each request.',
            writeDescriptionHere: 'Write a welcome message...',
            addCustomMessage: 'Add a custom welcome message',
            validation: {
              typeRequired: 'Select a booking type',
              welcomeMax: 'Max 400 characters',
            },
          },
        },
      },
    },
  })),
}));

function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  if (v === null || v === undefined) throw new Error('Expected defined value');
}

function requireSupportsFooterSave(
  c: SectionController
): asserts c is SectionController & { supportsFooterSave: () => boolean } {
  if (typeof c.supportsFooterSave !== 'function') {
    throw new Error('supportsFooterSave not implemented');
  }
}

function makeValues(
  type: 'INSTANT' | 'APPROVAL_REQUIRED' | null,
  welcome: string | null
): ListingEditorValues {
  return {
    setting: { statusSection: { status: 'UNLISTED' } },
    yourPlace: {
      bookingSettingsSection: {
        bookingType: type
          ? { value: type }
          : (null as unknown as { value: never }),
        welcomeMessage: welcome,
      },
    },
  } as unknown as ListingEditorValues;
}

function getRadioByLabel(label: string): HTMLInputElement {
  return screen.getByRole('radio', { name: label }) as HTMLInputElement;
}

function getActiveTextarea(): HTMLTextAreaElement {
  const all = screen.getAllByPlaceholderText(
    'Write a welcome message...'
  ) as HTMLTextAreaElement[];
  const enabled = all.find((el) => !el.hasAttribute('disabled'));
  assertDefined(enabled);
  return enabled;
}

describe('EditBookingConfiguration (React component)', () => {
  beforeEach(() => {
    const { useEditability } = jest.requireMock(
      '@/components/React/Host/EditListing/EditabilityContext'
    ) as { useEditability: jest.Mock };
    useEditability.mockReturnValue({ isReadOnly: false });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    const { useEditability } = jest.requireMock(
      '@/components/React/Host/EditListing/EditabilityContext'
    ) as { useEditability: jest.Mock };
    useEditability.mockReturnValue({ isReadOnly: false });
  });

  it('renders and shows type-required when no selection; selecting enables textarea and updates remaining counter', async () => {
    render(
      <EditBookingConfiguration
        lang="en"
        initialValues={makeValues(null, null)}
        onRegisterController={() => () => {}}
      />
    );

    expect(screen.getByText('Booking configuration')).toBeInTheDocument();

    const rInstant = getRadioByLabel('Instant booking');
    const rApproval = getRadioByLabel('Approval required');
    expect(rInstant.checked).toBe(false);
    expect(rApproval.checked).toBe(false);

    const typeErrors = screen.getAllByText('Select a booking type');
    expect(typeErrors).toHaveLength(2);

    fireEvent.click(rInstant);
    await waitFor(() => {
      expect(screen.queryAllByText('Select a booking type')).toHaveLength(0);
    });

    const ta = getActiveTextarea();
    fireEvent.change(ta, { target: { value: 'Hello' } });
    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent('395');
  });

  it('controller contract: slug, supportsFooterSave, dirty → buildPatch normalization (trim/null) → discard reset', async () => {
    const { useEditability } = jest.requireMock(
      '@/components/React/Host/EditListing/EditabilityContext'
    ) as { useEditability: jest.Mock };
    useEditability.mockReturnValue({ isReadOnly: false });

    const initial = makeValues('INSTANT', 'Welcome!');

    let captured: SectionController | undefined;
    const onRegisterController = (c: SectionController | null) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };

    render(
      <EditBookingConfiguration
        lang="en"
        initialValues={initial}
        onRegisterController={onRegisterController}
      />
    );

    assertDefined(captured);
    let ctrl = captured;

    expect(ctrl.getSlug()).toBe('booking');
    requireSupportsFooterSave(ctrl);
    expect(ctrl.supportsFooterSave()).toBe(true);
    expect(ctrl.isDirty()).toBe(false);

    const rApproval = getRadioByLabel('Approval required');
    fireEvent.click(rApproval);

    let ta = getActiveTextarea();
    fireEvent.change(ta, { target: { value: '   Be nice to guests  ' } });

    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(true);
    });

    ctrl = captured!;
    const patch1 = ctrl.buildPatch();
    const bk1 = patch1.yourPlace?.bookingSettingsSection;
    assertDefined(bk1);
    expect(bk1.bookingType.value).toBe('APPROVAL_REQUIRED');
    expect(bk1.welcomeMessage).toBe('Be nice to guests');

    ta = getActiveTextarea();
    fireEvent.change(ta, { target: { value: '     ' } });

    await waitFor(() => {
      assertDefined(captured);
      const p2 = captured.buildPatch();
      const bk2 = p2.yourPlace?.bookingSettingsSection;
      assertDefined(bk2);
      expect(bk2.bookingType.value).toBe('APPROVAL_REQUIRED');
      expect(bk2.welcomeMessage).toBeNull();
    });

    await act(async () => {
      ctrl.discard();
    });
    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(false);
    });

    const rInstant = getRadioByLabel('Instant booking');
    expect(rInstant.checked).toBe(true);
    const taBack = getActiveTextarea();
    expect(taBack.value).toBe('Welcome!');
  }, 10000);

  it('read-only mode: radios and textareas disabled; supportsFooterSave=false; values do not change', () => {
    const { useEditability } = jest.requireMock(
      '@/components/React/Host/EditListing/EditabilityContext'
    ) as { useEditability: jest.Mock };
    useEditability.mockReturnValue({ isReadOnly: true });

    let captured: SectionController | undefined;
    const onRegisterController = (c: SectionController | null) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };

    render(
      <EditBookingConfiguration
        lang="en"
        initialValues={makeValues('INSTANT', 'Hello!')}
        onRegisterController={onRegisterController}
      />
    );

    const rInstant = getRadioByLabel('Instant booking');
    const rApproval = getRadioByLabel('Approval required');
    expect(rInstant).toBeDisabled();
    expect(rApproval).toBeDisabled();

    const allTextareas = screen.getAllByPlaceholderText(
      'Write a welcome message...'
    ) as HTMLTextAreaElement[];
    expect(allTextareas.length).toBe(2);
    allTextareas.forEach((ta) => expect(ta).toBeDisabled());

    fireEvent.click(rApproval);
    expect(rInstant.checked).toBe(true);
    expect(rApproval.checked).toBe(false);

    assertDefined(captured);
    requireSupportsFooterSave(captured);
    expect(captured.supportsFooterSave()).toBe(false);
  });

  it('shows max-length error when initial welcome exceeds 400 characters; counter clamps to 0', () => {
    const long = 'x'.repeat(405);
    render(
      <EditBookingConfiguration
        lang="en"
        initialValues={makeValues('INSTANT', long)}
        onRegisterController={() => () => {}}
      />
    );

    const rInstant = getRadioByLabel('Instant booking');
    expect(rInstant.checked).toBe(true);

    const maxErrors = screen.getAllByText('Max 400 characters');
    expect(maxErrors).toHaveLength(2);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('0');
  });
});
