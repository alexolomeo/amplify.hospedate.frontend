import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import EditCapacity from '@/components/React/Host/EditListing/Content/YourPlace/EditCapacity';
import { act } from '@testing-library/react';

jest.mock('@/components/React/Common/DropdownV2', () => ({
  __esModule: true,
  default: ({
    options,
    value,
    onChange,
    disabled,
  }: {
    options: Array<{ value: number; label: string }>;
    value: number;
    onChange: (v: number | null) => void;
    disabled?: boolean;
  }) => (
    <select
      role="combobox"
      value={String(value)}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
    >
      {options.map((opt) => (
        <option key={opt.value} value={String(opt.value)}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock('@/components/React/Host/EditListing/EditabilityContext', () => ({
  __esModule: true,
  useEditability: jest.fn(() => ({ isReadOnly: false })),
}));

jest.mock('@/utils/i18n', () => ({
  getTranslation: jest.fn(() => ({
    hostContent: {
      editListing: {
        content: {
          editCapacity: {
            stepTitle: 'Capacity',
            options: ['1 guest', '2 guests', '3 guests'],
            validation: {
              required: 'Capacity is required',
              min: 'Minimum is 1',
              max: 'Exceeds maximum',
            },
          },
        },
      },
    },
  })),
}));

function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  if (v == null) throw new Error('Expected value to be defined');
}

const { useEditability } = jest.requireMock(
  '@/components/React/Host/EditListing/EditabilityContext'
) as { useEditability: jest.Mock };

function getSelect(): HTMLSelectElement {
  return screen.getByRole('combobox') as HTMLSelectElement;
}

function makeValues(people: number): ListingEditorValues {
  return {
    yourPlace: {
      peopleNumberSection: { peopleNumber: people },
    },
    setting: { statusSection: { status: 'UNLISTED' } },
  };
}

describe('EditCapacity (React component)', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders and clamps initial people to options max; shows options labels', () => {
    const onRegisterController = jest.fn(() => () => {});
    render(
      <EditCapacity
        lang="en"
        initialValues={makeValues(10)}
        onRegisterController={onRegisterController}
      />
    );

    const select = getSelect();
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('3');

    expect(screen.getByText('1 guest')).toBeInTheDocument();
    expect(screen.getByText('2 guests')).toBeInTheDocument();
    expect(screen.getByText('3 guests')).toBeInTheDocument();

    expect(onRegisterController).toHaveBeenCalledTimes(1);
  });

  it('controller contract: supportsFooterSave, isDirty, buildPatch, discard reset', async () => {
    let captured: SectionController | undefined;
    const onRegisterController = (ctrl: SectionController | null) => {
      if (ctrl) captured = ctrl;
      return () => {
        captured = undefined;
      };
    };

    render(
      <EditCapacity
        lang="en"
        initialValues={makeValues(2)}
        onRegisterController={onRegisterController}
      />
    );

    assertDefined(captured);
    expect(captured.getSlug()).toBe('capacity');
    expect(captured.supportsFooterSave?.()).toBe(true);
    expect(captured.isDirty()).toBe(false);

    fireEvent.change(getSelect(), { target: { value: '3' } });
    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(true);
    });

    const patch = captured.buildPatch();
    expect(patch.yourPlace?.peopleNumberSection?.peopleNumber).toBe(3);

    await act(async () => {
      captured!.discard();
    });
    await waitFor(() => {
      expect(getSelect()).toHaveValue('2');
      assertDefined(captured);
      expect(captured.isDirty()).toBe(false);
    });
  });

  it('read-only mode: select disabled, value does not change, supportsFooterSave=false', () => {
    useEditability.mockReturnValueOnce({ isReadOnly: true });

    let captured: SectionController | undefined;
    const onRegisterController = (c: SectionController | null) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };

    render(
      <EditCapacity
        lang="en"
        initialValues={makeValues(2)}
        onRegisterController={onRegisterController}
      />
    );

    const select = getSelect();
    expect(select).toBeDisabled();
    expect(select).toHaveValue('2');

    fireEvent.change(select, { target: { value: '3' } });
    expect(select).toHaveValue('2');

    assertDefined(captured);
    expect(captured.supportsFooterSave?.()).toBe(false);
  });
});
