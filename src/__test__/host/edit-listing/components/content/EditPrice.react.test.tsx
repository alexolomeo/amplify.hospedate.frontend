import React from 'react';
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import EditPrice from '@/components/React/Host/EditListing/Content/YourPlace/EditPrice';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import { MIN_NIGHT_PRICE } from '@/components/React/Utils/priceMath';
import { NIGHT_MAX } from '@/components/React/Utils/edit-listing/content/YourPlace/price/priceValidators';

jest.mock('@/components/React/Common/CollapseCard', () => ({
  __esModule: true,
  default: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => <div data-testid={`collapse-${title}`}>{children}</div>,
}));

jest.mock('@/components/React/Common/ToggleSwitch', () => ({
  __esModule: true,
  default: ({
    title,
    description,
    checked,
    onChange,
    disabled,
  }: {
    title?: string;
    description?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
  }) => (
    <label>
      <input
        data-testid={`toggle-${title ?? description ?? 'toggle'}`}
        type="checkbox"
        checked={checked}
        disabled={!!disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      {title ?? description ?? 'toggle'}
    </label>
  ),
}));

jest.mock('@/components/React/Common/SliderProgress', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    disabled,
    displayValue,
    displayUnit,
  }: {
    value: number;
    onChange: (pct: number) => void;
    disabled?: boolean;
    displayValue?: number;
    displayUnit?: string;
  }) => (
    <div>
      <input
        data-testid="slider"
        type="range"
        min={0}
        max={100}
        value={value}
        disabled={!!disabled}
        onChange={(e) => onChange(Number((e.target as HTMLInputElement).value))}
      />
      <span data-testid="slider-display">
        {displayValue != null ? `${displayValue}${displayUnit ?? ''}` : ''}
      </span>
    </div>
  ),
}));

jest.mock('@/components/React/Host/EditListing/EditabilityContext', () => ({
  useEditability: jest.fn(() => ({ isReadOnly: false })),
}));

jest.mock('@/utils/i18n', () => ({
  getTranslation: jest.fn(() => ({
    hostContent: {
      editListing: {
        content: {
          editPrice: {
            stepTitle: 'Edit price',
            description: 'Set your nightly price and optional discounts',
            nightlyTitle: 'Nightly',
            nightlyDescription: 'Base nightly price',
            weekendTitle: 'Weekend',
            weekendToggleTitle: 'Enable weekend price',
            discountsTitle: 'Discounts',
            discountsDescription: 'Weekly and monthly discounts',
            weekly: 'Weekly',
            weeklyHint: 'Affects 7-night stays',
            monthly: 'Monthly',
            monthlyHint: 'Affects 28-night stays',
            minNightPriceHint: `Min is ${MIN_NIGHT_PRICE}`,
            validation: {
              requiredNight: 'Nightly price is required',
              integerOnly: 'Only integers',
              maxNightPriceHint: `Max is ${NIGHT_MAX}`,
              minWeekendPriceHint: `Weekend min is ${MIN_NIGHT_PRICE}`,
              maxWeekendPriceHint: `Weekend max is ${NIGHT_MAX}`,
            },
            discountsRuleHint: 'Weekly discount cannot exceed monthly',
          },
        },
      },
    },
  })),
}));

function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  expect(v).toBeDefined();
}

function requireSupportsFooterSave(
  c: SectionController
): asserts c is SectionController & { supportsFooterSave: () => boolean } {
  if (typeof c.supportsFooterSave !== 'function') {
    throw new Error('Controller does not implement supportsFooterSave()');
  }
}

function makeValues(params?: {
  night?: number;
  weekend?: number | null;
  weekly?: number | null;
  monthly?: number | null;
}): ListingEditorValues {
  const night = params?.night ?? 200;
  const weekend = params?.weekend ?? null;
  const weekly = params?.weekly ?? null;
  const monthly = params?.monthly ?? null;

  return {
    yourPlace: {
      pricesSection: {
        perNight: { price: night },
        perWeekend: { price: weekend },
        discounts: { weekly, monthly },
      },
    },
    setting: { statusSection: { status: 'UNLISTED' } },
  };
}

function getNightInput(): HTMLInputElement {
  return screen.getByRole('spinbutton', { name: '' }) as HTMLInputElement;
}

function queryWeekendInput(): HTMLInputElement | null {
  const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
  return inputs.length > 1 ? inputs[1] : null;
}

describe('EditPrice (React component)', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders initial values and i18n texts', () => {
    const onRegisterController = jest.fn(() => () => {});
    render(
      <EditPrice
        lang="es"
        initialValues={makeValues({
          night: 250,
          weekend: null,
          weekly: 0.1,
          monthly: 0.2,
        })}
        onRegisterController={onRegisterController}
      />
    );

    expect(screen.getByText('Edit price')).toBeInTheDocument();
    expect(
      screen.getByText('Set your nightly price and optional discounts')
    ).toBeInTheDocument();

    const night = getNightInput();
    expect(night).toHaveValue(250);

    const weekendToggle = screen.getByTestId(
      'toggle-Enable weekend price'
    ) as HTMLInputElement;
    expect(weekendToggle).toBeInTheDocument();
    expect(weekendToggle).not.toBeChecked();

    const discountsToggle = screen.getByTestId(
      'toggle-Discounts'
    ) as HTMLInputElement;
    expect(discountsToggle).toBeChecked();

    expect(onRegisterController).toHaveBeenCalledTimes(1);
  });

  it('nightly validation shows/hides errors for required, integer, min, max', () => {
    const onRegisterController = jest.fn(() => () => {});
    render(
      <EditPrice
        lang="es"
        initialValues={makeValues({ night: 300 })}
        onRegisterController={onRegisterController}
      />
    );

    const night = getNightInput();

    fireEvent.change(night, { target: { value: '' } });
    expect(screen.getByText('Nightly price is required')).toBeInTheDocument();

    fireEvent.change(night, { target: { value: '12.5' } });
    expect(screen.getByText('Only integers')).toBeInTheDocument();

    fireEvent.change(night, { target: { value: String(MIN_NIGHT_PRICE - 1) } });
    expect(screen.getByText(`Min is ${MIN_NIGHT_PRICE}`)).toBeInTheDocument();

    fireEvent.change(night, { target: { value: String(NIGHT_MAX + 1) } });
    expect(screen.getByText(`Max is ${NIGHT_MAX}`)).toBeInTheDocument();

    fireEvent.change(night, { target: { value: String(MIN_NIGHT_PRICE) } });
    expect(
      screen.queryByText('Nightly price is required')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Only integers')).not.toBeInTheDocument();
    expect(
      screen.queryByText(`Min is ${MIN_NIGHT_PRICE}`)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(`Max is ${NIGHT_MAX}`)).not.toBeInTheDocument();
  });

  it('weekend toggle and validation: integerOnly/min/max; empty allowed while enabled', () => {
    const onRegisterController = jest.fn(() => () => {});
    render(
      <EditPrice
        lang="es"
        initialValues={makeValues({ night: MIN_NIGHT_PRICE, weekend: null })}
        onRegisterController={onRegisterController}
      />
    );

    const toggle = screen.getByTestId(
      'toggle-Enable weekend price'
    ) as HTMLInputElement;
    fireEvent.click(toggle);
    expect(toggle).toBeChecked();

    const weekend = queryWeekendInput();
    assertDefined(weekend);

    fireEvent.change(weekend, { target: { value: '9.9' } });
    expect(screen.getByText('Only integers')).toBeInTheDocument();

    fireEvent.change(weekend, {
      target: { value: String(MIN_NIGHT_PRICE - 1) },
    });
    expect(
      screen.getByText(`Weekend min is ${MIN_NIGHT_PRICE}`)
    ).toBeInTheDocument();

    fireEvent.change(weekend, { target: { value: String(NIGHT_MAX + 1) } });
    expect(screen.getByText(`Weekend max is ${NIGHT_MAX}`)).toBeInTheDocument();

    fireEvent.change(weekend, { target: { value: '' } });
    expect(screen.queryByText('Only integers')).not.toBeInTheDocument();
    expect(
      screen.queryByText(`Weekend min is ${MIN_NIGHT_PRICE}`)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(`Weekend max is ${NIGHT_MAX}`)
    ).not.toBeInTheDocument();
  });

  it('discounts rule & clamping: weekly cannot exceed monthly (shows hint)', async () => {
    render(
      <EditPrice
        lang="en"
        initialValues={{
          yourPlace: {
            pricesSection: {
              perNight: { price: 300 },
              perWeekend: { price: null },
              discounts: { weekly: 0.05, monthly: 0.1 },
            },
          },
          setting: { statusSection: { status: 'UNLISTED' } },
        }}
        onRegisterController={() => () => {}}
      />
    );

    const sliders = screen.getAllByTestId('slider') as HTMLInputElement[];
    const weeklySlider = sliders[0];
    const monthlySlider = sliders[1];

    fireEvent.change(weeklySlider, { target: { value: '60' } });

    await waitFor(() => {
      expect(
        screen.getByText('Weekly discount cannot exceed monthly')
      ).toBeInTheDocument();
    });

    fireEvent.change(monthlySlider, { target: { value: '10' } });

    await waitFor(() => {
      expect(
        screen.getByText('Weekly discount cannot exceed monthly')
      ).toBeInTheDocument();
    });
  });

  it('controller contract: supportsFooterSave, dirty transitions, buildPatch normalized, discard', async () => {
    let captured: SectionController | undefined;

    const onRegisterController = (ctrl: SectionController | null) => {
      if (ctrl) captured = ctrl;
      return () => {
        captured = undefined;
      };
    };

    render(
      <EditPrice
        lang="es"
        initialValues={makeValues({
          night: 300,
          weekend: null,
          weekly: 0.05,
          monthly: 0.1,
        })}
        onRegisterController={onRegisterController}
      />
    );

    assertDefined(captured);
    let ctrl = captured;

    expect(ctrl.getSlug()).toBe('price');

    requireSupportsFooterSave(ctrl);
    expect(ctrl.supportsFooterSave()).toBe(true);

    expect(ctrl.isDirty()).toBe(false);

    const night = getNightInput();
    fireEvent.change(night, {
      target: { value: String(MIN_NIGHT_PRICE + 10) },
    });

    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(true);
    });

    assertDefined(captured);
    ctrl = captured;

    const patch = ctrl.buildPatch();

    const yp = patch.yourPlace;
    assertDefined(yp);

    const prices = yp.pricesSection;
    assertDefined(prices);

    expect(prices.perNight.price).toBe(MIN_NIGHT_PRICE + 10);
    expect(prices.perWeekend.price).toBeNull();
    expect(prices.discounts.weekly).toBeCloseTo(0.05);
    expect(prices.discounts.monthly).toBeCloseTo(0.1);

    await act(async () => {
      ctrl.discard();
    });

    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(false);
    });

    expect(getNightInput()).toHaveValue(300);
  });

  it('read-only mode disables inputs/toggles and supportsFooterSave=false', () => {
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
      <EditPrice
        lang="en"
        initialValues={{
          yourPlace: {
            pricesSection: {
              perNight: { price: 350 },
              perWeekend: { price: 400 },
              discounts: { weekly: 0.05, monthly: 0.08 },
            },
          },
          setting: { statusSection: { status: 'UNLISTED' } },
        }}
        onRegisterController={onRegisterController}
      />
    );

    const spins = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    expect(spins.length).toBeGreaterThanOrEqual(2);
    expect(spins[0]).toHaveAttribute('readonly');
    expect(spins[1]).toHaveAttribute('readonly');

    expect(screen.getByTestId('toggle-Enable weekend price')).toBeDisabled();
    expect(screen.getByTestId('toggle-Discounts')).toBeDisabled();

    const sliders = screen.getAllByTestId('slider') as HTMLInputElement[];
    sliders.forEach((s) => expect(s).toBeDisabled());

    expect(captured).toBeDefined();
    if (!captured) return;
    expect(captured.supportsFooterSave?.()).toBe(false);
  }, 10000);
});
