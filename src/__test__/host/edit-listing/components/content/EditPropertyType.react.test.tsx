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

import EditPropertyType from '@/components/React/Host/EditListing/Content/YourPlace/EditPropertyType';
import type { CatalogsSelectors } from '@/components/React/Hooks/Host/EditListing/useEditListing';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import { act } from '@testing-library/react';
/* -------------------- Mocks -------------------- */

jest.mock('@/components/React/Host/EditListing/EditabilityContext', () => ({
  useEditability: jest.fn(() => ({ isReadOnly: false })),
}));

jest.mock('@/utils/i18n', () => ({
  getTranslation: jest.fn(() => ({
    hostContent: {
      editListing: {
        content: {
          editPropertyType: {
            stepTitle: 'Tipo de propiedad',
            descriptionLabel: 'Grupo',
            descriptionPlaceholder: 'Selecciona un grupo de propiedad',
            propertyTypeLabel: 'Tipo',
            propertyTypePlaceholder: 'Selecciona un tipo de propiedad',
            floorsLabel: 'Pisos',
            yearBuiltLabel: 'Año de construcción',
            yearBuiltPlaceholder: 'Ej. 2005',
            sizeLabel: 'Tamaño',
            sizePlaceholder: 'Ej. 75.5',
            sizeUnitPlaceholder: 'Unidad',
            groups: {
              Apartment: 'Apartment',
              House: 'House',
              'Secondary Unit': 'Secondary Unit',
              'Unique Space': 'Unique Space',
              'Bed and breakfast': 'Bed and breakfast',
              'Boutique Hotel': 'Boutique Hotel',
            },
            types: {
              'Rental Unit': 'Rental Unit',
              Condo: 'Condo',
              'Serviced Apartment': 'Serviced Apartment',
              Loft: 'Loft',
              Home: 'Home',
              Townhouse: 'Townhouse',
              Bungalow: 'Bungalow',
              Cabin: 'Cabin',
              Chalet: 'Chalet',
              'Earthen Home': 'Earthen Home',
              Hut: 'Hut',
              Lighthouse: 'Lighthouse',
              Villa: 'Villa',
              Dome: 'Dome',
              Cottage: 'Cottage',
              'Farm stay': 'Farm stay',
              Houseboat: 'Houseboat',
              'Tiny home': 'Tiny home',
              Guesthouse: 'Guesthouse',
              'Guest suite': 'Guest suite',
              Boat: 'Boat',
              Castle: 'Castle',
              Cave: 'Cave',
              'Earthen home': 'Earthen home',
              Hut2: 'Hut2',
              'Ice dome': 'Ice dome',
              Island: 'Island',
              Lighthouse2: 'Lighthouse2',
              Plane: 'Plane',
              'Camper/RV': 'Camper/RV',
              Tent: 'Tent',
              Tipi: 'Tipi',
              Train: 'Train',
              Treehouse: 'Treehouse',
              Yurt: 'Yurt',
              Other: 'Other',
              Dome2: 'Dome2',
              Barn: 'Barn',
              Campsite: 'Campsite',
              Windmill: 'Windmill',
              Bus: 'Bus',
              Ranch: 'Ranch',
              'Religious building': 'Religious building',
              'Shipping container': 'Shipping container',
              Tower: 'Tower',
              'Bed and breakfast': 'Bed and breakfast',
              'Nature lodge': 'Nature lodge',
              'Farm stay BnB': 'Farm stay BnB',
              'Boutique hotel': 'Boutique hotel',
              Hostel: 'Hostel',
              'Serviced apartment': 'Serviced apartment',
              Aparthotel: 'Aparthotel',
              Hotel: 'Hotel',
              Resort: 'Resort',
              Studio: 'Studio',
              'Entire place': 'Entire place',
              'Private room': 'Private room',
            },
            sizeUnits: {
              SQUARE_METERS: 'SQUARE_METERS',
              SQUARE_FEET: 'SQUARE_FEET',
            },
            validation: {
              requiredGroup: 'Grupo requerido',
              requiredType: 'Tipo requerido',
              floorsMin: 'Piso mínimo 1',
              floorsMax: 'Piso máximo 300',
              yearRange: 'Año fuera de rango',
              sizePositive: 'Tamaño debe ser positivo',
              sizeMaxTwoDecimals: 'Máximo 2 decimales',
              sizeMaxIntegerDigits: 'Máximo 9 dígitos enteros',
              unitRequired: 'Unidad requerida',
              sizeRequiredIfUnit: 'Tamaño requerido si seleccionas unidad',
            },
          },
        },
      },
    },
  })),
}));

jest.mock('@/components/React/Common/DropdownV2', () => {
  const Dropdown = ({
    options,
    value,
    onChange,
    placeholder,
    disabled,
    className,
  }: {
    options: Array<{ value: number | string; label: string }>;
    value: number | string | null;
    onChange: (v: number | string | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
  }) => {
    const isNumber = options.length > 0 && typeof options[0].value === 'number';
    return (
      <select
        aria-label={placeholder ?? 'dropdown'}
        data-testid={`dropdown-${placeholder ?? 'x'}`}
        disabled={disabled}
        className={className}
        value={value === null || value === undefined ? '' : String(value)}
        onChange={(e) => {
          const v = e.target.value;
          if (v === '') onChange(null);
          else onChange(isNumber ? Number(v) : v);
        }}
      >
        <option value="">{placeholder ?? ''}</option>
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    );
  };
  return { __esModule: true, default: Dropdown };
});

jest.mock('@/components/React/Common/QuantitySelector', () => {
  const QS = ({
    title,
    value,
    onIncrement,
    onDecrement,
    disabled,
  }: {
    title: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    disabled?: boolean;
  }) => (
    <div aria-label={title} data-testid="quantity-selector">
      <span data-testid="qs-value">{value}</span>
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled}
        data-testid="qs-dec"
      >
        -
      </button>
      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled}
        data-testid="qs-inc"
      >
        +
      </button>
    </div>
  );
  return { __esModule: true, default: QS };
});

/* -------------------- Helpers -------------------- */

function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  if (v === null || v === undefined) throw new Error('Expected defined');
}

function requireSupportsFooterSave(
  c: SectionController
): asserts c is SectionController & { supportsFooterSave: () => boolean } {
  if (typeof c.supportsFooterSave !== 'function') {
    throw new Error('Controller missing supportsFooterSave');
  }
}

const selectors: CatalogsSelectors = {
  propertyTypeGroups: [
    {
      id: 1,
      name: 'Apartment',
      propertyTypes: [
        { id: 1, name: 'Rental Unit', description: '', isBuilding: false },
        { id: 2, name: 'Condo', description: '', isBuilding: false },
        {
          id: 3,
          name: 'Serviced Apartment',
          description: '',
          isBuilding: false,
        },
        { id: 4, name: 'Loft', description: '', isBuilding: false },
      ],
    },
    {
      id: 2,
      name: 'House',
      propertyTypes: [
        { id: 5, name: 'Home', description: '', isBuilding: false },
        { id: 6, name: 'Townhouse', description: '', isBuilding: false },
      ],
    },
  ],
  propertySizeUnits: [
    { id: 'SQUARE_FEET', name: 'SQUARE_FEET' },
    { id: 'SQUARE_METERS', name: 'SQUARE_METERS' },
  ],
  advanceNoticeHours: [],
  sameDayAdvanceNoticeTimes: [],
  amenityGroups: [],
  quietHoursStartTimes: [],
  quietHoursEndTimes: [],
  checkInStartTimes: [],
  checkInEndTimes: [],
  checkoutTimes: [],
};

function makeValues(
  groupId: number | null,
  typeId: number | null,
  floorNumber = 2,
  yearBuilt: number | null = 2000,
  propertySize: number | null = 55.5,
  unitId: string | null = 'SQUARE_METERS'
): ListingEditorValues {
  return {
    setting: { statusSection: { status: 'UNLISTED' } },
    yourPlace: {
      propertyTypeSection: {
        propertyTypeGroup: { value: groupId as number },
        propertyType: { value: typeId as number },
        floorNumber,
        yearBuilt,
        propertySize,
        propertySizeUnit: { value: unitId },
      },
    },
  } as unknown as ListingEditorValues;
}

function getYearInput(): HTMLInputElement {
  return screen.getByPlaceholderText('Ej. 2005') as HTMLInputElement;
}

function getSizeInput(): HTMLInputElement {
  return screen.getByPlaceholderText('Ej. 75.5') as HTMLInputElement;
}

function expectDefined<T>(v: T): asserts v is NonNullable<T> {
  expect(v).toBeDefined();
}

/* -------------------- Tests -------------------- */

describe('EditPropertyType (React component)', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders with initial values and lists options', () => {
    const onRegisterController = jest.fn(() => () => {});
    render(
      <EditPropertyType
        selectors={selectors}
        lang="es"
        initialValues={makeValues(1, 1)}
        onRegisterController={onRegisterController}
      />
    );

    expect(screen.getByText('Tipo de propiedad')).toBeInTheDocument();

    const groupDd = screen.getByTestId(
      'dropdown-Selecciona un grupo de propiedad'
    ) as HTMLSelectElement;
    expect(groupDd.value).toBe('1');

    const typeDd = screen.getByTestId(
      'dropdown-Selecciona un tipo de propiedad'
    ) as HTMLSelectElement;
    expect(typeDd.value).toBe('1');

    const qs = screen.getByTestId('quantity-selector');
    expect(within(qs).getByTestId('qs-value')).toHaveTextContent('2');

    expect(getYearInput().value).toBe('2000');

    expect(getSizeInput().value).toBe('55.5');
    const unitDd = screen.getByTestId('dropdown-Unidad') as HTMLSelectElement;
    expect(unitDd.value).toBe('SQUARE_METERS');

    expect(onRegisterController).toHaveBeenCalled();
  });

  it('changing group invalidates mismatched type and shows required type error', async () => {
    render(
      <EditPropertyType
        selectors={selectors}
        lang="es"
        initialValues={makeValues(1, 1)}
        onRegisterController={() => () => {}}
      />
    );

    const groupDd = screen.getByTestId(
      'dropdown-Selecciona un grupo de propiedad'
    ) as HTMLSelectElement;
    const typeDd = screen.getByTestId(
      'dropdown-Selecciona un tipo de propiedad'
    ) as HTMLSelectElement;

    fireEvent.change(groupDd, { target: { value: '2' } });

    await waitFor(() => {
      expect(typeDd.value).toBe('');
      expect(screen.getByText('Tipo requerido')).toBeInTheDocument();
    });
  });

  it('year built validation: invalid year shows error and valid year clears it', async () => {
    render(
      <EditPropertyType
        selectors={selectors}
        lang="es"
        initialValues={makeValues(1, 1, 2, 2000)}
        onRegisterController={() => () => {}}
      />
    );

    const yearInput = getYearInput();

    fireEvent.change(yearInput, { target: { value: '3025' } });
    await waitFor(() => {
      expect(screen.getByText('Año fuera de rango')).toBeInTheDocument();
    });

    fireEvent.change(yearInput, { target: { value: '2020' } });
    await waitFor(() => {
      expect(screen.queryByText('Año fuera de rango')).not.toBeInTheDocument();
    });
  });

  it('size/unit validation matrix', async () => {
    render(
      <EditPropertyType
        selectors={selectors}
        lang="es"
        initialValues={makeValues(1, 1, 2, 2000, null, null)}
        onRegisterController={() => () => {}}
      />
    );

    const sizeInput = getSizeInput();
    const unitDd = screen.getByTestId('dropdown-Unidad') as HTMLSelectElement;

    fireEvent.change(unitDd, { target: { value: 'SQUARE_METERS' } });
    await waitFor(() => {
      expect(
        screen.getByText('Tamaño requerido si seleccionas unidad')
      ).toBeInTheDocument();
    });

    fireEvent.change(sizeInput, { target: { value: '0' } });
    await waitFor(() => {
      expect(screen.getByText('Tamaño debe ser positivo')).toBeInTheDocument();
    });

    fireEvent.change(sizeInput, { target: { value: '1.234' } });
    await waitFor(() => {
      expect(screen.getByText('Máximo 2 decimales')).toBeInTheDocument();
    });

    fireEvent.change(sizeInput, { target: { value: '1234567890' } });
    await waitFor(() => {
      expect(screen.getByText('Máximo 9 dígitos enteros')).toBeInTheDocument();
    });

    fireEvent.change(sizeInput, { target: { value: '75.5' } });
    fireEvent.change(unitDd, { target: { value: '' } });
    await waitFor(() => {
      expect(screen.getByText('Unidad requerida')).toBeInTheDocument();
    });

    fireEvent.change(unitDd, { target: { value: 'SQUARE_FEET' } });
    await waitFor(() => {
      expect(screen.queryByText('Unidad requerida')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Tamaño requerido si seleccionas unidad')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Tamaño debe ser positivo')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Máximo 2 decimales')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Máximo 9 dígitos enteros')
      ).not.toBeInTheDocument();
    });
  }, 10000);

  it('controller contract: supportsFooterSave, isDirty transitions, buildPatch normalization, discard', async () => {
    let captured: SectionController | undefined;
    const onRegisterController = (c: SectionController | null) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };

    render(
      <EditPropertyType
        selectors={selectors}
        lang="es"
        initialValues={makeValues(1, 1, 2, 2000, 55.5, 'SQUARE_METERS')}
        onRegisterController={onRegisterController}
      />
    );

    assertDefined(captured);
    let ctrl = captured;

    requireSupportsFooterSave(ctrl);
    expect(ctrl.supportsFooterSave()).toBe(true);

    expect(ctrl.isDirty()).toBe(false);

    const yearInput = getYearInput();
    fireEvent.change(yearInput, { target: { value: '1999' } });

    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(true);
    });

    const sizeInput = getSizeInput();
    fireEvent.change(sizeInput, { target: { value: '1.2.3' } });

    assertDefined(captured);
    ctrl = captured;

    const patch1 = ctrl.buildPatch();
    expect(patch1.yourPlace?.propertyTypeSection?.propertySize).toBeNull();

    fireEvent.change(sizeInput, { target: { value: '80.25' } });
    const unitDd = screen.getByTestId('dropdown-Unidad') as HTMLSelectElement;
    fireEvent.change(unitDd, { target: { value: 'SQUARE_FEET' } });

    assertDefined(captured);
    ctrl = captured;
    const patch2 = ctrl.buildPatch();
    const yp = patch2.yourPlace;
    expectDefined(yp);

    const pt = yp.propertyTypeSection;
    expectDefined(pt);
    expect(pt.propertyTypeGroup.value).toBe(1);
    expect(pt.propertyType.value).toBe(1);
    expect(pt.floorNumber).toBe(2);
    expect(pt.yearBuilt).toBe(1999);
    expect(pt.propertySize).toBeCloseTo(80.25);
    expect(pt.propertySizeUnit.value).toBe('SQUARE_FEET');

    await act(async () => {
      ctrl.discard();
    });
    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(false);
    });

    expect(getYearInput().value).toBe('2000');
    expect(
      (screen.getByTestId('dropdown-Unidad') as HTMLSelectElement).value
    ).toBe('SQUARE_METERS');
  });

  it('read-only mode disables all inputs and supportsFooterSave=false', () => {
    const { useEditability } = jest.requireMock(
      '@/components/React/Host/EditListing/EditabilityContext'
    ) as { useEditability: jest.Mock };
    useEditability.mockReturnValue({ isReadOnly: true });

    let captured: SectionController | undefined;
    const onRegisterController = (c: SectionController | null) => {
      if (c) captured = c;
      return () => (captured = undefined);
    };

    render(
      <EditPropertyType
        selectors={selectors}
        lang="es"
        initialValues={makeValues(1, 1)}
        onRegisterController={onRegisterController}
      />
    );

    expect(
      screen.getByTestId('dropdown-Selecciona un grupo de propiedad')
    ).toBeDisabled();
    expect(
      screen.getByTestId('dropdown-Selecciona un tipo de propiedad')
    ).toBeDisabled();
    expect(screen.getByTestId('dropdown-Unidad')).toBeDisabled();

    expect(getYearInput()).toHaveAttribute('readonly');
    expect(getSizeInput()).toHaveAttribute('readonly');

    assertDefined(captured);
    requireSupportsFooterSave(captured);
    expect(captured.supportsFooterSave()).toBe(false);
  });
});
