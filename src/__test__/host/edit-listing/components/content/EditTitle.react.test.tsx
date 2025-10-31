import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import EditTitle from '@/components/React/Host/EditListing/Content/YourPlace/EditTitle';

jest.mock('@/components/React/Host/EditListing/EditabilityContext', () => ({
  useEditability: jest.fn(() => ({ isReadOnly: false })),
}));

jest.mock('@/utils/i18n', () => ({
  getTranslation: jest.fn(() => ({
    hostContent: {
      editListing: {
        content: {
          editTitle: {
            stepTitle: 'Editar título',
            placeholder: 'Escribe el título de tu anuncio',
            validation: {
              required: 'El título es requerido',
              maxLength: 'Máximo 50 caracteres',
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

function makeValues(title: string): ListingEditorValues {
  return {
    yourPlace: { titleSection: { listingTitle: title } },
    setting: { statusSection: { status: 'UNLISTED' } },
  };
}

function getInput(): HTMLInputElement {
  return screen.getByRole('textbox') as HTMLInputElement;
}

describe('EditTitle (React component)', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders initial title and i18n texts', () => {
    const onRegisterController = jest.fn(() => {
      return () => {};
    });

    render(
      <EditTitle
        lang="es"
        initialValues={makeValues('Mi título')}
        onRegisterController={onRegisterController}
      />
    );

    expect(screen.getByText('Editar título')).toBeInTheDocument();

    const input = getInput();
    expect(input).toHaveValue('Mi título');
    expect(input).toHaveAttribute(
      'placeholder',
      'Escribe el título de tu anuncio'
    );

    expect(onRegisterController).toHaveBeenCalledTimes(1);
  });

  it('shows required error when cleared and hides it when valid value is set', () => {
    const onRegisterController = jest.fn(() => () => {});
    render(
      <EditTitle
        lang="es"
        initialValues={makeValues('Algo')}
        onRegisterController={onRegisterController}
      />
    );

    const input = getInput();

    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByText('El título es requerido')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Título válido' } });
    expect(
      screen.queryByText('El título es requerido')
    ).not.toBeInTheDocument();
  });

  it('shows max length error when exceeding 50 chars and hides it at 50', () => {
    const onRegisterController = jest.fn(() => () => {});
    render(
      <EditTitle
        lang="es"
        initialValues={makeValues('Base')}
        onRegisterController={onRegisterController}
      />
    );

    const input = getInput();

    fireEvent.change(input, { target: { value: 'a'.repeat(51) } });
    expect(screen.getByText('Máximo 50 caracteres')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'a'.repeat(50) } });
    expect(screen.queryByText('Máximo 50 caracteres')).not.toBeInTheDocument();
  });

  it('registers a controller and supportsFooterSave/isDirty/discard/buildPatch behave correctly', async () => {
    let captured: SectionController | undefined;

    const onRegisterController = (ctrl: SectionController | null) => {
      if (ctrl) captured = ctrl;
      return () => {
        captured = undefined;
      };
    };

    render(
      <EditTitle
        lang="es"
        initialValues={makeValues('  Hola mundo  ')}
        onRegisterController={onRegisterController}
      />
    );

    assertDefined(captured);
    let ctrl = captured;

    expect(ctrl.getSlug()).toBe('title');

    requireSupportsFooterSave(ctrl);
    expect(ctrl.supportsFooterSave()).toBe(true);

    expect(ctrl.isDirty()).toBe(false);

    const input = getInput();
    fireEvent.change(input, { target: { value: '  Hola mundo  !' } });

    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(true);
    });

    assertDefined(captured);
    ctrl = captured;

    const patch = ctrl.buildPatch();
    expect(patch.yourPlace?.titleSection?.listingTitle).toBe(
      'Hola mundo  !'.trim()
    );

    ctrl.discard();

    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(false);
    });

    expect(getInput()).toHaveValue('  Hola mundo  ');
  });

  it('in read-only mode: input is readonly, value does not change, no validation errors, supportsFooterSave=false', () => {
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
      <EditTitle
        lang="es"
        initialValues={makeValues('Título RO')}
        onRegisterController={onRegisterController}
      />
    );

    const input = getInput();
    expect(input).toHaveAttribute('readonly');

    fireEvent.change(input, { target: { value: '' } });
    expect(input).toHaveValue('Título RO');

    expect(
      screen.queryByText('El título es requerido')
    ).not.toBeInTheDocument();

    assertDefined(captured);
    requireSupportsFooterSave(captured);
    expect(captured.supportsFooterSave()).toBe(false);
  });
});
