import React from 'react';
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';

import EditGuestSafety from '@/components/React/Host/EditListing/Content/YourPlace/EditGuestSafety';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import { MODAL_MAX_CHARS } from '@/components/React/Utils/edit-listing/content/YourPlace/guestSafety/guestSafetyValidators';

jest.mock('@/components/React/Host/EditListing/EditabilityContext', () => ({
  useEditability: jest.fn(() => ({ isReadOnly: false })),
}));

jest.mock('@/components/React/Common/CollapseCard', () => {
  return function MockCollapseCard(props: {
    title: string;
    children: React.ReactNode;
  }) {
    const { title, children } = props;
    return <div data-testid={`collapse-${title}`}>{children}</div>;
  };
});

jest.mock('@/components/React/Common/ToggleSwitch', () => {
  return function ToggleSwitch(props: {
    title: string;
    description?: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (v: boolean) => void;
  }) {
    const { title, description, checked, disabled, onChange } = props;
    return (
      <label>
        <input
          type="checkbox"
          aria-label={title}
          data-testid={`toggle-${title}`}
          checked={checked}
          disabled={disabled}
          onChange={() => {
            if (!disabled) onChange(!checked);
          }}
        />
        <span>{title}</span>
        {description ? <small>{description}</small> : null}
      </label>
    );
  };
});

jest.mock('@/components/React/Common/Modal', () => {
  return function Modal(props: {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    footerLeft?: React.ReactNode;
  }) {
    const { open, children, footer, footerLeft } = props;
    if (!open) return null;
    return (
      <div role="dialog">
        <div>{children}</div>
        {footerLeft}
        {footer}
      </div>
    );
  };
});

jest.mock('@/utils/i18n', () => ({
  __esModule: true,
  getTranslation: jest.fn(() => ({
    common: { cancel: 'Cancel', save: 'Save' },
    hostContent: {
      editListing: {
        content: {
          editDescription: {
            charactersAvailable: 'characters available',
          },
          guestSafety: {
            title: 'Guest safety',
            description: 'Declare safety considerations and devices.',
            addInformation: 'Add information',
            modalPlaceholder: 'Write additional information...',
            validation: {
              detailsMax: 'Max 300 characters',
            },
            safetyConsiderations: {
              title: 'Safety considerations',
              notGoodForKidsAge2To12: {
                label: 'Not good for kids (2–12)',
                description: '',
              },
              notGoodForInfantsUnder2: {
                label: 'Not good for infants (under 2)',
                description: '',
              },
              unfencedPoolOrHotTub: {
                label: 'Unfenced pool or hot tub',
                description: '',
              },
              nearBodyOfWater: { label: 'Near body of water', description: '' },
              structuresToClimbOrPlay: {
                label: 'Structures to climb or play',
                description: '',
              },
              unprotectedElevatedAreas: {
                label: 'Unprotected elevated areas',
                description: '',
              },
              potentiallyDangerousAnimals: {
                label: 'Potentially dangerous animals',
                description: '',
              },
            },
            securityDevices: {
              title: 'Security devices',
              outdoorSecurityCamera: {
                label: 'Outdoor security camera',
                description: '',
              },
              noiseDecibelMonitor: {
                label: 'Noise decibel monitor',
                description: '',
              },
              carbonMonoxideDetector: {
                label: 'Carbon monoxide detector',
                description: '',
              },
              smokeDetector: { label: 'Smoke detector', description: '' },
            },
            propertyInformation: {
              title: 'Property information',
              guestsMustClimbStairs: {
                label: 'Guests must climb stairs',
                description: '',
              },
              noiseDuringStay: { label: 'Noise during stay', description: '' },
              petsLiveOnProperty: {
                label: 'Pets live on property',
                description: '',
              },
              noParkingOnProperty: {
                label: 'No parking on property',
                description: '',
              },
              commonAreas: { label: 'Common areas', description: '' },
              limitedBasicServices: {
                label: 'Limited basic services',
                description: '',
              },
              weaponsPresent: { label: 'Weapons present', description: '' },
            },
          },
        },
      },
    },
  })),
}));

function requireSupportsFooterSave(
  c: SectionController
): asserts c is SectionController & { supportsFooterSave: () => boolean } {
  if (typeof c.supportsFooterSave !== 'function') {
    throw new Error('Controller missing supportsFooterSave');
  }
}

function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  if (v === null || v === undefined) throw new Error('Expected defined value');
}

function requireApplyServerErrors(
  c: SectionController
): asserts c is SectionController & {
  applyServerErrors: (e: Record<string, string>) => void;
} {
  if (typeof c.applyServerErrors !== 'function') {
    throw new Error('Controller missing applyServerErrors');
  }
}

type YesNo = { status: boolean; details: string | null };

function makeValues(
  opts?: Partial<{
    sc: Partial<
      Record<
        | 'noChildrenAllowed'
        | 'noInfantsAllowed'
        | 'poolOrJacuzziWithNoFence'
        | 'lakeOrRiverOrWaterBody'
        | 'climbingOrPlayStructure'
        | 'heightsWithNoFence'
        | 'animals',
        YesNo
      >
    >;
    sd: Partial<
      Record<
        | 'surveillance'
        | 'noiseMonitor'
        | 'carbonMonoxideDetector'
        | 'smokeDetector',
        YesNo
      >
    >;
    pi: Partial<
      Record<
        | 'requiresStairs'
        | 'potentialNoise'
        | 'hasPets'
        | 'limitedParking'
        | 'sharedSpaces'
        | 'limitedAmenities'
        | 'weapons',
        YesNo
      >
    >;
  }>
): ListingEditorValues {
  const yes = (status = false, details: string | null = null): YesNo => ({
    status,
    details,
  });

  const sc = {
    noChildrenAllowed: yes(),
    noInfantsAllowed: yes(),
    poolOrJacuzziWithNoFence: yes(),
    lakeOrRiverOrWaterBody: yes(),
    climbingOrPlayStructure: yes(),
    heightsWithNoFence: yes(),
    animals: yes(),
    ...(opts?.sc ?? {}),
  };

  const sd = {
    surveillance: yes(),
    noiseMonitor: yes(),
    carbonMonoxideDetector: yes(),
    smokeDetector: yes(),
    ...(opts?.sd ?? {}),
  };

  const pi = {
    requiresStairs: yes(),
    potentialNoise: yes(),
    hasPets: yes(),
    limitedParking: yes(),
    sharedSpaces: yes(),
    limitedAmenities: yes(),
    weapons: yes(),
    ...(opts?.pi ?? {}),
  };

  const values: ListingEditorValues = {
    setting: { statusSection: { status: 'UNLISTED' } },
    yourPlace: {
      guestSecuritySection: {
        safetyConsiderations: sc,
        securityDevices: sd,
        propertyInformation: pi,
      },
    },
  } as unknown as ListingEditorValues;

  return values;
}

const qToggle = (label: string): HTMLInputElement =>
  screen.getByLabelText(label) as HTMLInputElement;

const getOnlyAddInfoButton = (): HTMLButtonElement => {
  const btns = screen.getAllByRole('button', { name: 'Add information' });
  expect(btns.length).toBeGreaterThan(0);
  return btns[0] as HTMLButtonElement;
};

afterEach(() => {
  jest.clearAllMocks();
  const { useEditability } = jest.requireMock(
    '@/components/React/Host/EditListing/EditabilityContext'
  ) as { useEditability: jest.Mock };
  useEditability.mockReturnValue({ isReadOnly: false });
  cleanup();
});

describe('EditGuestSafety (React component)', () => {
  it('renders with initial values; opens modal, saves trimmed details, updates patch and marks dirty', async () => {
    let captured: SectionController | undefined;
    const onRegisterController: (c: SectionController | null) => () => void = (
      c
    ) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };
    const initial = makeValues({
      sc: { noChildrenAllowed: { status: true, details: 'Kids not allowed' } },
    });

    render(
      <EditGuestSafety
        lang="en"
        initialValues={initial}
        onRegisterController={onRegisterController}
      />
    );
    expect(screen.getByText('Guest safety')).toBeInTheDocument();
    expect(
      screen.getByTestId('collapse-Safety considerations')
    ).toBeInTheDocument();
    expect(screen.getByTestId('collapse-Security devices')).toBeInTheDocument();
    expect(
      screen.getByTestId('collapse-Property information')
    ).toBeInTheDocument();
    const tgKids = qToggle('Not good for kids (2–12)');
    expect(tgKids.checked).toBe(true);

    const addBtn = getOnlyAddInfoButton();
    fireEvent.click(addBtn);

    const ta = screen.getByRole('textbox', {
      name: '',
    }) as HTMLTextAreaElement;
    expect(ta).toBeInTheDocument();
    expect(ta.value).toBe('Kids not allowed');

    const status = screen.getByText(/characters available/i);
    expect(status).toBeInTheDocument();
    fireEvent.change(ta, { target: { value: '  New info  ' } });

    const save = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(save);

    assertDefined(captured);
    expect(captured.getSlug()).toBe('guest-safety');
    expect(captured.isDirty()).toBe(true);

    const patch1 = captured.buildPatch();
    const sec = patch1.yourPlace?.guestSecuritySection;
    assertDefined(sec);
    expect(sec.safetyConsiderations.noChildrenAllowed.status).toBe(true);
    expect(sec.safetyConsiderations.noChildrenAllowed.details).toBe('New info');
  });

  it('controller contract: supportsFooterSave, toggle a device, buildPatch maps Yes/No with null details, and discard resets', async () => {
    let captured: SectionController | undefined;
    const onRegisterController: (c: SectionController | null) => () => void = (
      c
    ) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };

    const initial = makeValues({
      sc: { noChildrenAllowed: { status: false, details: null } },
      sd: { smokeDetector: { status: false, details: null } },
    });

    render(
      <EditGuestSafety
        lang="en"
        initialValues={initial}
        onRegisterController={onRegisterController}
      />
    );

    assertDefined(captured);
    requireSupportsFooterSave(captured);
    expect(captured.supportsFooterSave()).toBe(true);
    expect(captured.isDirty()).toBe(false);

    const tgSmoke = qToggle('Smoke detector');
    expect(tgSmoke.checked).toBe(false);
    fireEvent.click(tgSmoke);

    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(true);
    });

    const patch = captured.buildPatch();
    const sec = patch.yourPlace?.guestSecuritySection;
    assertDefined(sec);
    expect(sec.safetyDevices.smokeDetector.status).toBe(true);
    expect(sec.safetyDevices.smokeDetector.details).toBeNull();

    await act(async () => {
      captured!.discard();
    });

    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(false);
    });

    expect(qToggle('Smoke detector').checked).toBe(false);
  });

  it('read-only mode: toggles and Add information are disabled; modal does not open; supportsFooterSave=false', () => {
    const { useEditability } = jest.requireMock(
      '@/components/React/Host/EditListing/EditabilityContext'
    ) as { useEditability: jest.Mock };
    useEditability.mockReturnValue({ isReadOnly: true });

    let captured: SectionController | undefined;
    const onRegisterController: (c: SectionController | null) => () => void = (
      c
    ) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };

    const initial = makeValues({
      sc: { noChildrenAllowed: { status: true, details: 'info' } },
    });

    render(
      <EditGuestSafety
        lang="en"
        initialValues={initial}
        onRegisterController={onRegisterController}
      />
    );

    expect(qToggle('Not good for kids (2–12)')).toBeDisabled();

    const addBtn = getOnlyAddInfoButton();
    expect(addBtn).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(addBtn);
    expect(screen.queryByRole('textbox', { name: '' })).not.toBeInTheDocument();

    assertDefined(captured);
    requireSupportsFooterSave(captured);
    expect(captured.supportsFooterSave()).toBe(false);
  });

  it('validation: shows detailsMax error when initial details exceed 300 chars', () => {
    const long = 'x'.repeat(MODAL_MAX_CHARS + 1);
    const initial = makeValues({
      sc: { noChildrenAllowed: { status: true, details: long } },
    });

    const onRegisterController: (c: SectionController | null) => () => void =
      () => () => {};

    render(
      <EditGuestSafety
        lang="en"
        initialValues={initial}
        onRegisterController={onRegisterController}
      />
    );

    expect(screen.getByText('Max 300 characters')).toBeInTheDocument();
  });

  it('applyServerErrors: paints messages on arbitrary keys (e.g., sc.noChildrenAllowed and sd.noiseMonitor)', async () => {
    let captured: SectionController | undefined;
    const onRegisterController: (c: SectionController | null) => () => void = (
      c
    ) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };

    const initial = makeValues({
      sc: { noChildrenAllowed: { status: false, details: null } },
      sd: { noiseMonitor: { status: false, details: null } },
    });

    render(
      <EditGuestSafety
        lang="en"
        initialValues={initial}
        onRegisterController={onRegisterController}
      />
    );

    assertDefined(captured);
    const ctrl = captured;
    requireApplyServerErrors(ctrl);

    await act(async () => {
      ctrl.applyServerErrors({
        'sc.noChildrenAllowed': 'Please add a short note.',
        'sd.noiseMonitor': 'Please add a short note.',
      });
    });
    expect(
      screen.getAllByText('Please add a short note.').length
    ).toBeGreaterThanOrEqual(2);
  });
});
