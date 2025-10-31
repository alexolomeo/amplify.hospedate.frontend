import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import EditDirections from '@/components/React/Host/EditListing/Content/ArrivalGuide/EditDirections';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import { DIRECTIONS_MAX_CHARS } from '@/components/React/Utils/edit-listing/content/ArrivalGuide/directions/directionsValidators';

jest.mock('@/components/React/Host/EditListing/EditabilityContext', () => ({
  useEditability: jest.fn(() => ({ isReadOnly: false })),
}));

jest.mock('@/utils/i18n', () => ({
  getTranslation: jest.fn(() => ({
    hostContent: {
      editListing: {
        content: {
          editDirections: {
            title: 'Instrucciones de llegada',
            placeholder: 'Describe cómo llegar al alojamiento',
            validation: {
              max: `Máximo ${DIRECTIONS_MAX_CHARS} caracteres`,
            },
          },
        },
      },
    },
  })),
}));

function assertDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Expected value to be defined');
  }
}

function requireSupportsFooterSave(
  c: SectionController
): asserts c is SectionController & { supportsFooterSave: () => boolean } {
  if (typeof c.supportsFooterSave !== 'function') {
    throw new Error('Controller does not implement supportsFooterSave');
  }
}

function getTextarea(): HTMLTextAreaElement {
  const el = screen.getByRole('textbox');
  if (!(el instanceof HTMLTextAreaElement)) {
    throw new Error('Expected a textarea');
  }
  return el;
}

function makeControllerCapture() {
  let current: SectionController | undefined;
  let version = 0;

  const onRegisterController = (ctrl: SectionController | null) => {
    if (ctrl) {
      current = ctrl;
      version += 1;
    } else {
      current = null as unknown as undefined;
      version += 1;
    }
    return () => {
      // cleanup
    };
  };

  const get = () => {
    assertDefined(current);
    return current;
  };

  const getVersion = () => version;

  const waitNextVersion = async (prev: number) => {
    await waitFor(() => {
      expect(version).toBeGreaterThan(prev);
    });
  };

  return { onRegisterController, get, getVersion, waitNextVersion };
}

beforeEach(() => {
  jest.resetAllMocks();

  const { useEditability } = jest.requireMock(
    '@/components/React/Host/EditListing/EditabilityContext'
  ) as { useEditability: jest.Mock };
  useEditability.mockReturnValue({ isReadOnly: false });

  const { getTranslation } = jest.requireMock('@/utils/i18n') as {
    getTranslation: jest.Mock;
  };
  getTranslation.mockReturnValue({
    hostContent: {
      editListing: {
        content: {
          editDirections: {
            title: 'Instrucciones de llegada',
            placeholder: 'Describe cómo llegar al alojamiento',
            validation: {
              max: `Máximo ${DIRECTIONS_MAX_CHARS} caracteres`,
            },
          },
        },
      },
    },
  });
});

describe('EditDirections (React component)', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders title, placeholder and initial text; applies maxLength', () => {
    const { onRegisterController } = makeControllerCapture();

    render(
      <EditDirections
        lang="es"
        initialDirections="Punto de referencia: Plaza Central"
        onRegisterController={onRegisterController}
      />
    );

    expect(screen.getByText('Instrucciones de llegada')).toBeInTheDocument();

    const textarea = getTextarea();
    expect(textarea).toHaveValue('Punto de referencia: Plaza Central');
    expect(textarea).toHaveAttribute(
      'placeholder',
      'Describe cómo llegar al alojamiento'
    );
    expect(textarea).toHaveAttribute('maxlength', String(DIRECTIONS_MAX_CHARS));
  });

  it('shows client validation error when exceeding max chars and hides it when corrected', () => {
    const { onRegisterController } = makeControllerCapture();

    render(
      <EditDirections
        lang="es"
        initialDirections=""
        onRegisterController={onRegisterController}
      />
    );

    const textarea = getTextarea();

    const over = 'x'.repeat(DIRECTIONS_MAX_CHARS + 1);
    fireEvent.change(textarea, { target: { value: over } });

    expect(
      screen.getByText(`Máximo ${DIRECTIONS_MAX_CHARS} caracteres`)
    ).toBeInTheDocument();

    const valid = 'x'.repeat(DIRECTIONS_MAX_CHARS);
    fireEvent.change(textarea, { target: { value: valid } });

    expect(
      screen.queryByText(`Máximo ${DIRECTIONS_MAX_CHARS} caracteres`)
    ).not.toBeInTheDocument();
  });

  it('registers a controller and supportsFooterSave/isDirty/discard/buildPatch behave correctly (normalization & null when empty)', async () => {
    const capture = makeControllerCapture();

    render(
      <EditDirections
        lang="es"
        initialDirections="  Llegar hasta la esquina y girar a la derecha  "
        onRegisterController={capture.onRegisterController}
      />
    );

    const initialCtrl = capture.get();
    expect(initialCtrl.getSlug()).toBe('directions');
    requireSupportsFooterSave(initialCtrl);
    expect(initialCtrl.supportsFooterSave()).toBe(true);
    expect(initialCtrl.isDirty()).toBe(false);

    const textarea = getTextarea();
    const prevVersion = capture.getVersion();
    fireEvent.change(textarea, {
      target: { value: '  Llegar hasta la esquina y girar a la derecha !!!  ' },
    });

    await capture.waitNextVersion(prevVersion);
    const ctrlAfterEdit = capture.get();
    await waitFor(() => {
      expect(ctrlAfterEdit.isDirty()).toBe(true);
    });

    const patch1 = ctrlAfterEdit.buildPatch();
    const indications1 =
      patch1.arrivalGuide?.indicationsSection?.indications ?? null;
    expect(indications1).toBe(
      'Llegar hasta la esquina y girar a la derecha !!!'
    );

    const prevVersion2 = capture.getVersion();
    fireEvent.change(textarea, { target: { value: '    ' } });

    await capture.waitNextVersion(prevVersion2);
    const ctrlSpaces = capture.get();

    const patch2 = ctrlSpaces.buildPatch();
    const indications2 =
      patch2.arrivalGuide?.indicationsSection?.indications ?? null;
    expect(indications2).toBeNull();

    await act(async () => {
      ctrlSpaces.discard();
    });

    await waitFor(() => {
      expect(getTextarea()).toHaveValue(
        '  Llegar hasta la esquina y girar a la derecha  '
      );
    });

    const afterDiscardCtrl = capture.get();
    expect(afterDiscardCtrl.isDirty()).toBe(false);
  }, 10000);

  it('applies server-side errors via controller.applyServerErrors and clears them on user input', async () => {
    const capture = makeControllerCapture();

    render(
      <EditDirections
        lang="es"
        initialDirections=""
        onRegisterController={capture.onRegisterController}
      />
    );

    const ctrl = capture.get();

    await act(async () => {
      ctrl.applyServerErrors?.({ 'directions.text': 'Error del servidor' });
    });

    expect(screen.getByText('Error del servidor')).toBeInTheDocument();

    const textarea = getTextarea();
    fireEvent.change(textarea, { target: { value: 'Nueva indicación' } });

    await waitFor(() => {
      expect(screen.queryByText('Error del servidor')).not.toBeInTheDocument();
    });
  });

  it('re-hydrates (realigns form & baseline) when initialDirections prop changes (simulating refresh)', async () => {
    const { onRegisterController } = makeControllerCapture();

    const { rerender } = render(
      <EditDirections
        lang="es"
        initialDirections="Primera versión"
        onRegisterController={onRegisterController}
      />
    );

    const textarea = getTextarea();
    fireEvent.change(textarea, { target: { value: 'Editando…' } });
    expect(textarea.value).toBe('Editando…');

    rerender(
      <EditDirections
        lang="es"
        initialDirections="Versión del servidor"
        onRegisterController={onRegisterController}
      />
    );

    await waitFor(() => {
      expect(getTextarea()).toHaveValue('Versión del servidor');
    });
  });

  it('read-only mode: textarea is readOnly, value does not change on input, no validation errors, supportsFooterSave=false', () => {
    const { useEditability } = jest.requireMock(
      '@/components/React/Host/EditListing/EditabilityContext'
    ) as { useEditability: jest.Mock };
    useEditability.mockReturnValue({ isReadOnly: true });

    const capture = makeControllerCapture();

    render(
      <EditDirections
        lang="es"
        initialDirections="Solo lectura"
        onRegisterController={capture.onRegisterController}
      />
    );

    const textarea = getTextarea();
    expect(textarea).toHaveAttribute('readonly');

    fireEvent.change(textarea, { target: { value: 'Intento' } });
    expect(textarea).toHaveValue('Solo lectura');

    expect(
      screen.queryByText(`Máximo ${DIRECTIONS_MAX_CHARS} caracteres`)
    ).not.toBeInTheDocument();

    const ctrl = capture.get();
    requireSupportsFooterSave(ctrl);
    expect(ctrl.supportsFooterSave()).toBe(false);
  });

  it('watchValidity seed is consistent and validate() reflects over-limit state on the latest controller', async () => {
    const { useEditability } = jest.requireMock(
      '@/components/React/Host/EditListing/EditabilityContext'
    ) as { useEditability: jest.Mock };
    useEditability.mockReturnValue({ isReadOnly: false });

    const capture = makeControllerCapture();

    render(
      <EditDirections
        lang="es"
        initialDirections="Dentro del límite"
        onRegisterController={capture.onRegisterController}
      />
    );

    const seedCtrl = capture.get();
    let seeded: boolean | undefined;
    act(() => {
      seedCtrl.watchValidity?.((v) => {
        seeded = v;
      });
    });
    await act(async () => {});
    expect(seeded).toBe(true);

    const textarea = getTextarea();
    const prevVersion = capture.getVersion();
    fireEvent.change(textarea, {
      target: { value: 'y'.repeat(DIRECTIONS_MAX_CHARS + 1) },
    });

    await capture.waitNextVersion(prevVersion);
    const latestCtrl = capture.get();

    const res = latestCtrl.validate();
    expect(res.ok).toBe(false);
  });
});
