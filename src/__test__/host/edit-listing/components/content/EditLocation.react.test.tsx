import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@/components/React/Host/EditListing/EditabilityContext', () => ({
  useEditability: jest.fn(() => ({ isReadOnly: false })),
}));

jest.mock('@/utils/i18n', () => ({
  getTranslation: jest.fn(() => ({
    hostContent: {
      editListing: {
        content: {
          editLocation: {
            title: 'Dirección del alojamiento',
            countryLabel: 'País',
            addressLabel: 'Dirección',
            addressPlaceholder: 'Escribe la dirección...',
            aptLabel: 'Departamento / Nro. apto',
            aptPlaceholder: 'Ej. 2B',
            cityLabel: 'Ciudad',
            cityPlaceholder: 'Escribe la ciudad...',
            stateLabel: 'Estado/Departamento',
            statePlaceholder: 'Escribe el estado...',
            showExactLocationTitle: 'Mostrar ubicación exacta',
            showExactLocationDescription:
              'Activa esta opción para mostrar la ubicación precisa en el mapa',
            privacyTitle: 'Privacidad de la dirección',
            privacyDescription:
              'Tu dirección completa solo se compartirá con los huéspedes confirmados.',
            approximateLocationLabel: 'Ubicación aproximada',
            validation: {
              required: 'Campo requerido',
              coordsRequired:
                'Debes seleccionar una ubicación válida en el mapa',
              showExactRequired: 'Debes indicar si muestras ubicación exacta',
              privacyRequired:
                'Debes indicar si la dirección se muestra al cancelar',
            },
          },
        },
      },
    },
  })),
}));

import type { GoogleMapProps } from '@/components/React/Common/GoogleMap';
import * as ReactNS from 'react';
jest.mock('@/components/React/Common/GoogleMap', () => {
  const MockMap = (props: GoogleMapProps): ReactNS.JSX.Element => (
    <div data-testid="mock-map">
      MAP({props.latitude},{props.longitude})
    </div>
  );
  return { __esModule: true, default: MockMap };
});

type GeocodeResult = {
  coords: { latitude: number; longitude: number };
  components: ReadonlyArray<unknown>;
};
jest.mock('@/components/React/Hooks/useGeocoder', () => {
  const geocodeFullAddress = jest.fn<Promise<GeocodeResult>, [string]>(() =>
    Promise.resolve({
      coords: { latitude: -16.5, longitude: -68.15 },
      components: [],
    })
  );
  const geocodeByCoords = jest.fn<
    Promise<GeocodeResult>,
    [{ latitude: number; longitude: number }]
  >(() =>
    Promise.resolve({
      coords: { latitude: -16.5, longitude: -68.15 },
      components: [],
    })
  );
  return {
    __esModule: true,
    useGeocoder: () => ({
      isLoaded: false,
      geocodeFullAddress,
      geocodeByCoords,
    }),
  };
});

import EditLocation from '@/components/React/Host/EditListing/Content/YourPlace/EditLocation';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';

function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  if (v === null || v === undefined) throw new Error('Expected defined value');
}
function requireSupportsFooterSave(
  c: SectionController
): asserts c is SectionController & { supportsFooterSave: () => boolean } {
  if (
    typeof (c as { supportsFooterSave?: () => boolean }).supportsFooterSave !==
    'function'
  ) {
    throw new Error('supportsFooterSave not implemented');
  }
}

const initial = {
  location: {
    address: 'Av. Siempre Viva 742 ',
    apt: ' 2B ',
    city: ' La Paz ',
    state: ' Murillo ',
    country: 'Bolivia',
    coordinates: { latitude: -16.9050784321, longitude: -68.1336123456 },
  },
  showExact: true,
  addressPrivacyOnCancel: false,
  canEditFields: true,
} as const;

describe('EditLocation (basic)', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders heading and registers a controller (slug + supportsFooterSave)', async () => {
    let captured: SectionController | undefined;
    const onRegisterController = (ctrl: SectionController | null) => {
      if (ctrl) captured = ctrl;
      return () => {
        captured = undefined;
      };
    };

    render(
      <EditLocation
        lang="es"
        initial={initial}
        onRegisterController={onRegisterController}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Dirección del alojamiento' })
    ).toBeInTheDocument();

    expect(screen.getByTestId('mock-map')).toBeInTheDocument();

    assertDefined(captured);
    expect(captured.getSlug()).toBe('address');
    requireSupportsFooterSave(captured);
    expect(captured.supportsFooterSave()).toBe(true);
    expect(captured.isDirty()).toBe(false);
  });
});
