import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';

import EditCheckInMethod from '@/components/React/Host/EditListing/Content/ArrivalGuide/EditCheckInMethod';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';

jest.mock('@/components/React/Host/EditListing/EditabilityContext', () => ({
  useEditability: jest.fn(() => ({ isReadOnly: false })),
}));

jest.mock('@/utils/i18n', () => ({
  getTranslation: jest.fn(() => ({
    hostContent: {
      editListing: {
        content: {
          editCheckInMethod: {
            title: 'Método de check-in',
            method: {
              title: 'Selecciona un método',
              options: {
                smartLock: { label: 'Cerradura inteligente', description: '' },
                keypad: { label: 'Cerradura con teclado', description: '' },
                lockbox: { label: 'Caja de seguridad', description: '' },
                staff: { label: 'Personal del edificio', description: '' },
                inPerson: { label: 'Encuentro en persona', description: '' },
                other: { label: 'Otro', description: '' },
              },
            },
            instructions: {
              title: 'Instrucciones de llegada',
              subtitle: 'Subtítulo de prueba',
              description: 'Descripción de prueba',
              placeholder: 'Escribe las instrucciones aquí...',
            },
            validation: {
              methodRequired: 'Selecciona un método de check-in',
              instructionsMax: 'Máximo 2000 caracteres',
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

function getInstructionsTextarea(): HTMLTextAreaElement {
  return screen.getByPlaceholderText(
    'Escribe las instrucciones aquí...'
  ) as HTMLTextAreaElement;
}

describe('EditCheckInMethod (React component)', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders title and options, shows required error when no method is selected', () => {
    render(
      <EditCheckInMethod
        lang="es"
        initialMethodId={undefined}
        initialInstructions=""
        onRegisterController={() => () => {}}
      />
    );

    expect(screen.getByText('Método de check-in')).toBeInTheDocument();
    expect(screen.getByText('Selecciona un método')).toBeInTheDocument();

    expect(
      screen.getByText('Selecciona un método de check-in')
    ).toBeInTheDocument();
  });

  it('controller contract: slug, supportsFooterSave, dirty → buildPatch normalization (trim/null) → discard reset', async () => {
    let captured: SectionController | undefined;
    const onRegisterController = (c: SectionController | null) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };

    render(
      <EditCheckInMethod
        lang="es"
        initialMethodId="SMART_LOCK"
        initialInstructions="Llegar hasta la esquina"
        onRegisterController={onRegisterController}
      />
    );

    assertDefined(captured);
    let ctrl = captured;

    expect(ctrl.getSlug()).toBe('check-in-method');
    requireSupportsFooterSave(ctrl);
    expect(ctrl.supportsFooterSave()).toBe(true);
    expect(ctrl.isDirty()).toBe(false);

    const radioOther = screen.getByLabelText('Otro') as HTMLInputElement;
    fireEvent.click(radioOther);

    const textarea = getInstructionsTextarea();
    fireEvent.change(textarea, { target: { value: '   Editado   ' } });

    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(true);
    });

    ctrl = captured!;
    const patch1 = ctrl.buildPatch();
    const sec1 = patch1.arrivalGuide?.checkInMethodsSection;
    assertDefined(sec1);
    expect(sec1.checkInMethods.checkInMethod.value).toBe('OTHER');
    expect(sec1.checkInInstructions.instructions).toBe('Editado');

    fireEvent.change(textarea, { target: { value: '   ' } });
    await waitFor(() => {
      assertDefined(captured);
      const p2 = captured.buildPatch();
      const sec2 = p2.arrivalGuide?.checkInMethodsSection;
      assertDefined(sec2);
      expect(sec2.checkInInstructions.instructions).toBeNull();
    });

    await act(async () => {
      ctrl.discard();
    });
    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(false);
    });

    const radioSmart = screen.getByLabelText(
      'Cerradura inteligente'
    ) as HTMLInputElement;
    expect(radioSmart.checked).toBe(true);
    expect(getInstructionsTextarea().value).toBe('Llegar hasta la esquina');
  });

  it('read-only mode: radios and textarea disabled; supportsFooterSave=false', () => {
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
      <EditCheckInMethod
        lang="es"
        initialMethodId="IN_PERSON"
        initialInstructions="Texto RO"
        onRegisterController={onRegisterController}
      />
    );

    const radioInPerson = screen.getByLabelText(
      'Encuentro en persona'
    ) as HTMLInputElement;
    expect(radioInPerson).toBeDisabled();

    const textarea = getInstructionsTextarea();
    expect(textarea).toBeDisabled();

    assertDefined(captured);
    requireSupportsFooterSave(captured);
    expect(captured.supportsFooterSave()).toBe(false);
  });
});
