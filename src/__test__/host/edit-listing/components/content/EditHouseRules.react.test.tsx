import React from 'react';
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';

import EditHouseRules from '@/components/React/Host/EditListing/Content/YourPlace/EditHouseRules';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import type { CatalogsSelectors } from '@/components/React/Hooks/Host/EditListing/useEditListing';
import {
  FLEXIBLE_ID,
  PETS_MAX,
  GUEST_MAX,
  ADDITIONAL_MAX,
} from '@/components/React/Utils/edit-listing/content/YourPlace/houseRules/houseRulesValidators';

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

jest.mock('@/components/React/Common/SelectField', () => {
  type Option = { value: string; label: string };
  type Props = {
    options: Option[];
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
    placeholder?: string;
  };
  const SelectField = ({
    options,
    value,
    onChange,
    disabled,
    placeholder,
  }: Props) => {
    const opts =
      value === ''
        ? [{ value: '', label: placeholder ?? '' }, ...options]
        : options;

    return (
      <select
        role="combobox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  };
  return { __esModule: true, default: SelectField };
});

jest.mock('@/components/React/Common/QuantitySelector', () => {
  type Props = {
    title: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    min: number;
    max: number;
    disabled?: boolean;
  };
  const QuantitySelector = ({
    title,
    value,
    onIncrement,
    onDecrement,
    disabled,
  }: Props) => {
    return (
      <div>
        <p>{title}</p>
        <button
          type="button"
          onClick={() => {
            if (!disabled) onDecrement();
          }}
          data-testid={`dec-${title}`}
          aria-label={`dec-${title}`}
          disabled={disabled}
        >
          -
        </button>
        <span data-testid={`value-${title}`}>{value}</span>
        <button
          type="button"
          onClick={() => {
            if (!disabled) onIncrement();
          }}
          data-testid={`inc-${title}`}
          aria-label={`inc-${title}`}
          disabled={disabled}
        >
          +
        </button>
      </div>
    );
  };
  return { __esModule: true, default: QuantitySelector };
});

jest.mock('@/components/React/Common/ToggleSwitch', () => {
  type Props = {
    title: string;
    description?: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (v: boolean) => void;
  };
  const ToggleSwitch = ({ title, checked, disabled, onChange }: Props) => {
    return (
      <label>
        <input
          type="checkbox"
          aria-label={title}
          checked={checked}
          disabled={disabled}
          onChange={() => {
            if (!disabled) onChange(!checked);
          }}
        />
        <span>{title}</span>
      </label>
    );
  };
  return { __esModule: true, default: ToggleSwitch };
});

jest.mock('@/utils/i18n', () => ({
  __esModule: true,
  getTranslation: jest.fn(() => ({
    hostContent: {
      editListing: {
        content: {
          houseRules: {
            title: 'House rules',
            description: 'Define rules and times.',
            placeholder: 'Select…',
            permissions: {
              title: 'Permissions',
              petsAllowed: 'Pets allowed',
              petsAllowedDescription: 'You accept pets.',
              maxPetsAllowed: 'Max pets allowed',
              eventsAllowed: 'Events allowed',
              smokingVapingShishaAllowed: 'Smoking, vaping or shisha allowed',
              commercialPhotographyFilmingAllowed:
                'Commercial photography/filming allowed',
              maxPeopleAllowed: 'Max people allowed',
            },
            quietHours: {
              title: 'Quiet hours',
              toggleLabel: 'Enable quiet hours',
              startTime: 'Start time',
              endTime: 'End time',
            },
            checkInOutHours: {
              title: 'Check-in/out hours',
              arrivalHour: 'Arrival',
              departureHour: 'Departure',
              startTime: 'Start time',
              endTime: 'End time',
              selectTime: 'Select time',
            },
            additionalRules: {
              title: 'Additional rules',
              description: 'Add any extra rules for your place.',
              textAreaPlaceholder: 'Write additional rules...',
            },
            validation: {
              numPetsMin: 'At least 1 pet',
              numPetsMax: `At most ${PETS_MAX} pets`,
              guestMin: 'At least 1 guest',
              guestMax: `At most ${GUEST_MAX} guests`,
              quietStartRequired: 'Select a quiet-hours start',
              quietEndRequired: 'Select a quiet-hours end',
              checkinStartRequired: 'Select a check-in start',
              checkinEndBeforeStart: 'End must be after start',
              checkoutRequired: 'Select a checkout time',
              additionalMax: `Max ${ADDITIONAL_MAX} characters`,
              checkinEndRequired: 'Select a check-in end',
            },
          },
        },
      },
    },
  })),
}));

type RawCatalog = {
  quietHours: {
    startTimes: { id: number; name: string }[];
    endTimes: { id: number; name: string }[];
  };
  checkInOut: {
    checkInStartTimes: { id: number; name: string }[];
    checkInEndTimes: { id: number; name: string }[];
    checkoutTimes: { id: number; name: string }[];
  };
};

function toSelectors(c: RawCatalog): CatalogsSelectors {
  const minimal = {
    quietHoursStartTimes: c.quietHours.startTimes,
    quietHoursEndTimes: c.quietHours.endTimes,
    checkInStartTimes: c.checkInOut.checkInStartTimes,
    checkInEndTimes: c.checkInOut.checkInEndTimes,
    checkoutTimes: c.checkInOut.checkoutTimes,
  };
  return minimal as unknown as CatalogsSelectors;
}

const rawCatalog: RawCatalog = {
  quietHours: {
    startTimes: Array.from({ length: 24 }, (_, id) => ({
      id,
      name: `${id === 0 ? 12 : id % 12} ${id < 12 ? 'a.m.' : 'p.m.'}`,
    })),
    endTimes: Array.from({ length: 24 }, (_, id) => ({
      id,
      name: `${id === 0 ? 12 : id % 12} ${id < 12 ? 'a.m.' : 'p.m.'}`,
    })),
  },
  checkInOut: {
    checkInStartTimes: [
      { id: -1, name: 'Flexible' },
      ...Array.from({ length: 24 }, (_, id) => ({
        id,
        name: `${id === 0 ? 12 : id % 12} ${id < 12 ? 'a.m.' : 'p.m.'}`,
      })),
    ],
    checkInEndTimes: [
      { id: -1, name: 'Flexible' },
      ...Array.from({ length: 17 }, (_, i) => {
        const id = 10 + i;
        const map: Record<number, string> = {
          24: '12 a.m. (next day)',
          25: '1 a.m. (next day)',
          26: '2 a.m. (next day)',
        };
        const name =
          map[id] ?? `${id === 0 ? 12 : id % 12} ${id < 12 ? 'a.m.' : 'p.m.'}`;
        return { id, name };
      }),
    ],
    checkoutTimes: [
      { id: -1, name: 'Flexible' },
      ...Array.from({ length: 16 }, (_, i) => {
        const id = 8 + i;
        return {
          id,
          name: `${id === 0 ? 12 : id % 12} ${id < 12 ? 'a.m.' : 'p.m.'}`,
        };
      }),
    ],
  },
};

const selectors: CatalogsSelectors = toSelectors(rawCatalog);

function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  if (v === null || v === undefined) throw new Error('Expected defined value');
}

function requireSupportsFooterSave(
  c: SectionController
): asserts c is SectionController & { supportsFooterSave: () => boolean } {
  if (typeof c.supportsFooterSave !== 'function') {
    throw new Error('Controller missing supportsFooterSave');
  }
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

const qToggle = (label: string): HTMLInputElement =>
  screen.getByLabelText(label) as HTMLInputElement;

const qQtyVal = (title: string): number =>
  Number((screen.getByTestId(`value-${title}`).textContent ?? '0').trim());

const clickInc = (title: string, times = 1): void => {
  const btn = screen.getByTestId(`inc-${title}`);
  for (let i = 0; i < times; i += 1) fireEvent.click(btn);
};

const selectsIn = (collapseTitle: string): HTMLSelectElement[] => {
  const box = screen.getByTestId(`collapse-${collapseTitle}`);
  return within(box).queryAllByRole('combobox') as HTMLSelectElement[];
};

afterEach(() => {
  jest.clearAllMocks();
  const { useEditability } = jest.requireMock(
    '@/components/React/Host/EditListing/EditabilityContext'
  ) as { useEditability: jest.Mock };
  useEditability.mockReturnValue({ isReadOnly: false });
  cleanup();
});

describe('EditHouseRules (React component)', () => {
  it('renders with initial values and marks correct widgets', () => {
    const onRegisterController: (c: SectionController | null) => () => void =
      () => () => {};

    render(
      <EditHouseRules
        lang="en"
        selectors={selectors}
        initialQuietEnabled
        initialQuietStartId={22}
        initialQuietEndId={6}
        initialCheckinStartId={12}
        initialCheckinEndId={16}
        initialCheckoutId={11}
        initialPermissions={{
          petsAllowed: true,
          numPets: 2,
          eventsAllowed: false,
          smokingAllowed: true,
          commercialPhotographyAllowed: false,
          guestNumber: 4,
        }}
        initialAdditionalRulesText="Some rules"
        onRegisterController={onRegisterController}
      />
    );

    expect(screen.getByText('House rules')).toBeInTheDocument();
    expect(screen.getByTestId('collapse-Permissions')).toBeInTheDocument();
    expect(screen.getByTestId('collapse-Quiet hours')).toBeInTheDocument();
    expect(
      screen.getByTestId('collapse-Check-in/out hours')
    ).toBeInTheDocument();
    expect(screen.getByTestId('collapse-Additional rules')).toBeInTheDocument();

    expect(qToggle('Pets allowed').checked).toBe(true);
    expect(qQtyVal('Max pets allowed')).toBe(2);
    expect(qToggle('Smoking, vaping or shisha allowed').checked).toBe(true);
    expect(qQtyVal('Max people allowed')).toBe(4);

    const [qStart, qEnd] = selectsIn('Quiet hours');
    expect(qStart.value).toBe('22');
    expect(qEnd.value).toBe('6');

    const [ciStart, ciEnd, co] = selectsIn('Check-in/out hours');
    expect(ciStart.value).toBe('12');
    expect(ciEnd.value).toBe('16');
    expect(co.value).toBe('11');

    const ta = screen.getByPlaceholderText(
      'Write additional rules...'
    ) as HTMLTextAreaElement;
    expect(ta.value).toBe('Some rules');
  });

  it('controller contract: slug/supportsFooterSave; edit values → buildPatch clamps/normalizes; discard resets UI', async () => {
    let captured: SectionController | undefined;
    const onRegisterController: (c: SectionController | null) => () => void = (
      c
    ) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };

    render(
      <EditHouseRules
        lang="en"
        selectors={selectors}
        initialQuietEnabled={false}
        initialCheckinStartId={10}
        initialCheckinEndId={12}
        initialCheckoutId={8}
        initialPermissions={{
          petsAllowed: false,
          numPets: 0,
          eventsAllowed: false,
          smokingAllowed: false,
          commercialPhotographyAllowed: false,
          guestNumber: 1,
        }}
        initialAdditionalRulesText="   "
        onRegisterController={onRegisterController}
      />
    );

    assertDefined(captured);
    requireSupportsFooterSave(captured);
    expect(captured.getSlug()).toBe('house-rules');
    expect(captured.supportsFooterSave()).toBe(true);
    expect(captured.isDirty()).toBe(false);

    fireEvent.click(qToggle('Pets allowed'));
    clickInc('Max pets allowed', PETS_MAX + 3);

    fireEvent.click(qToggle('Enable quiet hours'));
    {
      const [qStart, qEnd] = selectsIn('Quiet hours');
      fireEvent.change(qStart, { target: { value: '21' } });
      fireEvent.change(qEnd, { target: { value: '1' } });
    }

    clickInc('Max people allowed', GUEST_MAX + 10);

    const ta = screen.getByPlaceholderText(
      'Write additional rules...'
    ) as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: '  Hello world  ' } });

    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(true);
    });

    const patch = captured.buildPatch();
    const hr = patch.yourPlace?.houseRulesSection;
    assertDefined(hr);

    expect(hr.permissions.petsAllowed).toBe(true);
    expect(hr.permissions.numPets).toBe(PETS_MAX);
    expect(hr.permissions.eventsAllowed).toBe(false);
    expect(hr.permissions.smokingAllowed).toBe(false);
    expect(hr.permissions.commercialPhotographyAllowed).toBe(false);
    expect(hr.permissions.guestNumber).toBe(GUEST_MAX);

    expect(hr.quietHours?.isEnabled).toBe(true);
    expect(hr.quietHours?.startTime?.value).toBe(21);
    expect(hr.quietHours?.endTime?.value).toBe(1);

    expect(hr.checkInOut?.checkInStartTime?.value).toBe(10);
    expect(hr.checkInOut?.checkInEndTime?.value).toBe(12);
    expect(hr.checkInOut?.checkoutTime?.value).toBe(8);

    expect(hr.additionalRules?.text).toBe('Hello world');

    await act(async () => {
      captured!.discard();
    });
    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(false);
    });

    expect(qToggle('Pets allowed').checked).toBe(false);
    expect(qQtyVal('Max pets allowed')).toBe(0);

    expect(qToggle('Enable quiet hours').checked).toBe(false);
  }, 10000);

  it('check-in Flexible: al elegir Flexible deshabilita y limpia el end; el patch omite checkInEndTime', () => {
    const onRegisterController: (c: SectionController | null) => () => void =
      () => () => {};

    render(
      <EditHouseRules
        lang="en"
        selectors={selectors}
        initialCheckinStartId={12}
        initialCheckinEndId={16}
        initialCheckoutId={11}
        onRegisterController={onRegisterController}
      />
    );

    const [ciStart, ciEnd] = selectsIn('Check-in/out hours');

    fireEvent.change(ciStart, { target: { value: String(FLEXIBLE_ID) } });

    expect(ciEnd).toBeDisabled();
    expect(ciEnd.value).toBe('');

    let captured: SectionController | undefined;
    const capture: (c: SectionController | null) => () => void = (c) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };

    cleanup();
    render(
      <EditHouseRules
        lang="en"
        selectors={selectors}
        initialCheckinStartId={FLEXIBLE_ID}
        initialCheckinEndId={null}
        initialCheckoutId={11}
        onRegisterController={capture}
      />
    );

    assertDefined(captured);
    const patch = captured.buildPatch();
    const hr = patch.yourPlace?.houseRulesSection;
    assertDefined(hr);

    expect(hr.checkInOut?.checkInStartTime?.value).toBe(FLEXIBLE_ID);
    expect('checkInEndTime' in (hr.checkInOut as object)).toBe(false);
  });

  it('validations: quiet hours required fields; check-in required/ordering; pets & guests & additional length', () => {
    const onRegisterController: (c: SectionController | null) => () => void =
      () => () => {};

    render(
      <EditHouseRules
        lang="en"
        selectors={selectors}
        initialQuietEnabled
        onRegisterController={onRegisterController}
      />
    );
    expect(screen.getByText('Select a quiet-hours start')).toBeInTheDocument();
    expect(screen.getByText('Select a quiet-hours end')).toBeInTheDocument();

    cleanup();
    render(
      <EditHouseRules
        lang="en"
        selectors={selectors}
        onRegisterController={onRegisterController}
      />
    );
    expect(screen.getByText('Select a check-in start')).toBeInTheDocument();
    expect(screen.getByText('Select a checkout time')).toBeInTheDocument();

    cleanup();
    render(
      <EditHouseRules
        lang="en"
        selectors={selectors}
        initialCheckinStartId={12}
        initialCheckoutId={11}
        onRegisterController={onRegisterController}
      />
    );
    expect(screen.getByText('Select a check-in end')).toBeInTheDocument();

    cleanup();
    render(
      <EditHouseRules
        lang="en"
        selectors={selectors}
        initialCheckinStartId={12}
        initialCheckinEndId={10}
        initialCheckoutId={11}
        onRegisterController={onRegisterController}
      />
    );
    expect(screen.getByText('End must be after start')).toBeInTheDocument();

    cleanup();
    render(
      <EditHouseRules
        lang="en"
        selectors={selectors}
        initialPermissions={{
          petsAllowed: true,
          numPets: 0,
          eventsAllowed: false,
          smokingAllowed: false,
          commercialPhotographyAllowed: false,
          guestNumber: 1,
        }}
        initialCheckoutId={11}
        initialCheckinStartId={FLEXIBLE_ID}
        onRegisterController={onRegisterController}
      />
    );
    expect(screen.getByText('At least 1 pet')).toBeInTheDocument();

    cleanup();
    render(
      <EditHouseRules
        lang="en"
        selectors={selectors}
        initialPermissions={{
          petsAllowed: false,
          numPets: 0,
          eventsAllowed: false,
          smokingAllowed: false,
          commercialPhotographyAllowed: false,
          guestNumber: 0,
        }}
        initialCheckoutId={11}
        initialCheckinStartId={FLEXIBLE_ID}
        onRegisterController={onRegisterController}
      />
    );
    expect(screen.getByText('At least 1 guest')).toBeInTheDocument();

    cleanup();
    render(
      <EditHouseRules
        lang="en"
        selectors={selectors}
        initialAdditionalRulesText={'x'.repeat(ADDITIONAL_MAX + 1)}
        initialCheckoutId={11}
        initialCheckinStartId={FLEXIBLE_ID}
        onRegisterController={onRegisterController}
      />
    );
    expect(
      screen.getByText(`Max ${ADDITIONAL_MAX} characters`)
    ).toBeInTheDocument();
  });

  it('read-only mode: todo deshabilitado; supportsFooterSave=false; no cambios', () => {
    const { useEditability } = jest.requireMock(
      '@/components/React/Host/EditListing/EditabilityContext'
    ) as { useEditability: jest.Mock };
    useEditability.mockReturnValue({ isReadOnly: true });

    let captured: SectionController | undefined;
    const capture: (c: SectionController | null) => () => void = (c) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };

    render(
      <EditHouseRules
        lang="en"
        selectors={selectors}
        initialQuietEnabled
        initialQuietStartId={22}
        initialQuietEndId={6}
        initialCheckinStartId={12}
        initialCheckinEndId={16}
        initialCheckoutId={11}
        initialPermissions={{
          petsAllowed: true,
          numPets: 2,
          eventsAllowed: true,
          smokingAllowed: true,
          commercialPhotographyAllowed: true,
          guestNumber: 4,
        }}
        initialAdditionalRulesText="Rules"
        onRegisterController={capture}
      />
    );

    expect(qToggle('Pets allowed')).toBeDisabled();
    expect(qToggle('Enable quiet hours')).toBeDisabled();

    selectsIn('Quiet hours').forEach((s) => expect(s).toBeDisabled());
    selectsIn('Check-in/out hours').forEach((s) => expect(s).toBeDisabled());

    const vPets = qQtyVal('Max pets allowed');
    const vGuests = qQtyVal('Max people allowed');
    clickInc('Max pets allowed');
    clickInc('Max people allowed');
    expect(qQtyVal('Max pets allowed')).toBe(vPets);
    expect(qQtyVal('Max people allowed')).toBe(vGuests);

    const ta = screen.getByPlaceholderText(
      'Write additional rules...'
    ) as HTMLTextAreaElement;
    expect(ta).toBeDisabled();

    assertDefined(captured);
    requireSupportsFooterSave(captured);
    expect(captured.supportsFooterSave()).toBe(false);
  });

  it('applyServerErrors: pinta mensajes para múltiples claves', async () => {
    let captured: SectionController | undefined;
    const onRegisterController: (c: SectionController | null) => () => void = (
      c
    ) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };

    render(
      <EditHouseRules
        lang="en"
        selectors={selectors}
        onRegisterController={onRegisterController}
      />
    );

    assertDefined(captured);
    requireApplyServerErrors(captured);
    const ctrl = captured;

    await act(async () => {
      ctrl.applyServerErrors({
        'permissions.numPets': 'Provide number of pets',
        'permissions.guestNumber': 'Provide number of guests',
        'quietHours.startId': 'Pick quiet start',
        'quietHours.endId': 'Pick quiet end',
        'checkInOut.checkInStartId': 'Pick check-in start',
        'checkInOut.checkInEndId': 'Pick check-in end',
        'checkInOut.checkoutId': 'Pick checkout',
        'additionalRules.text': 'Text too long',
      });
    });

    expect(screen.getByText('Provide number of pets')).toBeInTheDocument();
    expect(screen.getByText('Provide number of guests')).toBeInTheDocument();
    expect(screen.getByText('Pick quiet start')).toBeInTheDocument();
    expect(screen.getByText('Pick quiet end')).toBeInTheDocument();
    expect(screen.getByText('Pick check-in start')).toBeInTheDocument();
    expect(screen.getByText('Pick check-in end')).toBeInTheDocument();
    expect(screen.getByText('Pick checkout')).toBeInTheDocument();
    expect(screen.getByText('Text too long')).toBeInTheDocument();
  });
});
