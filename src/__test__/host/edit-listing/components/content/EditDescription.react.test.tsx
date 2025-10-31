import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import EditDescription from '@/components/React/Host/EditListing/Content/YourPlace/EditDescription';
import { act } from '@testing-library/react';

jest.mock('@/components/React/Common/CollapseCard', () => {
  return function MockCollapseCard(props: {
    title: string;
    children: React.ReactNode;
  }) {
    const { title, children } = props;
    return <div data-testid={`collapse-${title}`}>{children}</div>;
  };
});

jest.mock('@/components/React/Host/EditListing/EditabilityContext', () => ({
  useEditability: jest.fn(() => ({ isReadOnly: false })),
}));

jest.mock('@/utils/i18n', () => ({
  getTranslation: jest.fn(() => ({
    hostContent: {
      editListing: {
        content: {
          editDescription: {
            stepTitle: 'Edit description',
            charactersAvailable: 'characters available',
            spaceSection: {
              title: 'Space',
              label: 'Listing description',
              placeholder: 'Describe your space...',
              validation: {
                required: 'Listing description is required',
                max: 'Max 500 characters',
              },
            },
            propertySection: {
              title: 'Property',
              description: 'Tell guests about the property.',
              placeholder: 'Property details...',
              validation: {
                max: 'Too long',
              },
            },
            guestExperience: {
              title: 'Guest experience',
              access: {
                title: 'Access',
                description: 'What areas can guests access?',
                placeholder: 'Access details...',
                validation: { max: 'Too long' },
              },
              interaction: {
                title: 'Interaction',
                description: 'How much will you interact with guests?',
                placeholder: 'Interaction details...',
                validation: { max: 'Too long' },
              },
              highlights: {
                title: 'Highlights',
                description: 'Anything extra guests should know?',
                placeholder: 'Highlights...',
                validation: { max: 'Too long' },
              },
            },
          },
        },
      },
    },
  })),
}));

function makeValues(init?: Partial<ListingEditorValues>): ListingEditorValues {
  return {
    yourPlace: {
      descriptionSection: {
        generalDescription: {
          listingDescription: 'A cozy place',
          propertyDescription: '2BR apartment with balcony',
        },
        guestExperience: {
          areasDescription: 'Guests can access kitchen and living room',
          interactionDescription: 'Available via chat',
          additionalNotes: 'No smoking',
        },
      },
      ...(init?.yourPlace ?? {}),
    },
    ...(init ?? {}),
  } as ListingEditorValues;
}

function getByLabel(label: string): HTMLTextAreaElement {
  return screen.getByLabelText(label) as HTMLTextAreaElement;
}

function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  if (v === null || v === undefined) {
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

describe('EditDescription (React component)', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders initial values and updates the character counter; required validation on listing description', () => {
    const onRegisterController = jest.fn(() => () => {});
    render(
      <EditDescription
        lang="en"
        initialValues={makeValues()}
        onRegisterController={onRegisterController}
      />
    );

    expect(screen.getByText('Edit description')).toBeInTheDocument();

    const space = getByLabel('Listing description');
    const property = getByLabel('Property');
    const access = getByLabel('Access');
    const interaction = getByLabel('Interaction');
    const highlights = getByLabel('Highlights');

    expect(space).toHaveValue('A cozy place');
    expect(property).toHaveValue('2BR apartment with balcony');
    expect(access).toHaveValue('Guests can access kitchen and living room');
    expect(interaction).toHaveValue('Available via chat');
    expect(highlights).toHaveValue('No smoking');

    const remaining = 500 - 'A cozy place'.length;
    expect(
      screen.getByText(`${remaining} characters available`)
    ).toBeInTheDocument();

    fireEvent.change(space, { target: { value: '' } });
    expect(
      screen.getByText('Listing description is required')
    ).toBeInTheDocument();

    fireEvent.change(space, { target: { value: 'Nice and bright' } });
    expect(
      screen.queryByText('Listing description is required')
    ).not.toBeInTheDocument();
  });

  it('controller contract: slug, supportsFooterSave, dirty → buildPatch normalization → discard reset', async () => {
    jest.clearAllMocks();

    const { useEditability } = jest.requireMock(
      '@/components/React/Host/EditListing/EditabilityContext'
    ) as { useEditability: jest.Mock };
    useEditability.mockReturnValue({ isReadOnly: false });

    const init: ListingEditorValues = {
      yourPlace: {
        descriptionSection: {
          generalDescription: {
            listingDescription: 'A cozy place',
            propertyDescription: 'Near downtown',
          },
          guestExperience: {
            areasDescription: '',
            interactionDescription: '',
            additionalNotes: '',
          },
        },
      },
      setting: { statusSection: { status: 'UNLISTED' } },
    };

    let captured: SectionController | undefined;
    const onRegisterController = (c: SectionController | null) => {
      if (c) captured = c;
      return () => {
        captured = undefined;
      };
    };

    render(
      <EditDescription
        lang="en"
        initialValues={init}
        onRegisterController={onRegisterController}
      />
    );

    assertDefined(captured);
    expect(captured.getSlug()).toBe('description');
    expect(captured.supportsFooterSave?.()).toBe(true);
    expect(captured.isDirty()).toBe(false);

    const listing = screen.getByLabelText(
      'Listing description'
    ) as HTMLTextAreaElement;
    const property = screen.getByLabelText('Property') as HTMLTextAreaElement;
    const highlights = screen.getByLabelText(
      'Highlights'
    ) as HTMLTextAreaElement;

    fireEvent.change(listing, { target: { value: '  New listing  ' } });
    fireEvent.change(property, { target: { value: '  Updated property  ' } });
    fireEvent.change(highlights, { target: { value: '   ' } });

    await waitFor(() => {
      expect(listing.value).toBe('  New listing  ');
      assertDefined(captured);
      expect(captured.isDirty()).toBe(true);
    });

    assertDefined(captured);
    const currentCtrl: SectionController = captured;

    const patch = currentCtrl.buildPatch();
    const gen = patch.yourPlace?.descriptionSection?.generalDescription;
    const guest = patch.yourPlace?.descriptionSection?.guestExperience;
    assertDefined(gen);
    assertDefined(guest);

    expect(gen.listingDescription).toBe('New listing');
    expect(gen.propertyDescription).toBe('Updated property');
    expect(guest.additionalNotes).toBeNull();

    act(() => {
      currentCtrl.discard();
    });

    await waitFor(() => {
      assertDefined(captured);
      expect(captured.isDirty()).toBe(false);
    });

    expect(
      (screen.getByLabelText('Listing description') as HTMLTextAreaElement)
        .value
    ).toBe('A cozy place');
  });

  it('read-only mode: all textareas are readOnly, values do not change, supportsFooterSave=false', () => {
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
      <EditDescription
        lang="en"
        initialValues={makeValues()}
        onRegisterController={onRegisterController}
      />
    );

    const space = getByLabel('Listing description');
    const property = getByLabel('Property');
    const access = getByLabel('Access');
    const interaction = getByLabel('Interaction');
    const highlights = getByLabel('Highlights');

    expect(space).toHaveAttribute('readonly');
    expect(property).toHaveAttribute('readonly');
    expect(access).toHaveAttribute('readonly');
    expect(interaction).toHaveAttribute('readonly');
    expect(highlights).toHaveAttribute('readonly');

    fireEvent.change(space, { target: { value: 'X' } });
    expect(space).toHaveValue('A cozy place');

    assertDefined(captured);
    requireSupportsFooterSave(captured);
    expect(captured.supportsFooterSave()).toBe(false);
  });
});
