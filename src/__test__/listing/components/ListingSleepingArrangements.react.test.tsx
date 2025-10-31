import { fireEvent, render, screen } from '@testing-library/react';
import type { PhotoListingDetail, Space } from '@/types/listing/space';
import { SleepingArrangementType } from '@/types/enums/sleepingArrangement';
import ListingSleepingArrangements from '@/components/React/Listing/ListingSleepingArrangements';
import { getTranslation } from '@/utils/i18n';

const mockPhoto: PhotoListingDetail = {
  original: 'photo1.jpg',
  caption: 'Test photo',
  order: 1,
  srcsetWebp: '300w.webp 300w, 600w.webp 600w',
  srcsetAvif: '300w.avif 300w, 600w.avif 600w',
};
const mockSpaces: Space[] = [
  {
    id: 1,
    isDefault: false,
    name: 'Habitación 1',
    photos: [mockPhoto, { ...mockPhoto, original: 'photo2.jpg', order: 2 }],
    amenities: [
      { name: 'WiFi', icon: '', amenityGroup: '' },
      { name: 'Parking', icon: '', amenityGroup: '' },
    ],
    sleepingArrangements: [
      { type: SleepingArrangementType.Queen, quantity: 1 },
    ],
  },
];
const mockSpacesEmpty: Space[] = [
  {
    id: 1,
    isDefault: false,
    name: 'Habitación 1',
    photos: [mockPhoto, { ...mockPhoto, original: 'photo2.jpg', order: 2 }],
    amenities: [
      { name: 'WiFi', icon: '', amenityGroup: '' },
      { name: 'Parking', icon: '', amenityGroup: '' },
    ],
  },
];

test('renders title when spaces with sleeping arrangements are provided', () => {
  const t = getTranslation('es');
  render(
    <ListingSleepingArrangements
      spaces={mockSpaces}
      lang="es"
      open={jest.fn()}
    />
  );
  const title = screen.getByText(t.listingDetail.sleepingArrangements.title);
  const sectionName = screen.getByText('Habitación 1');
  expect(title).toBeInTheDocument();
  expect(sectionName).toBeInTheDocument();
});

test('Opens modal when button is clicked', () => {
  const mockOpenFn = jest.fn();
  render(
    <ListingSleepingArrangements
      spaces={mockSpaces}
      lang="es"
      open={mockOpenFn}
    />
  );
  const button = screen.getByTestId('space-arragement-test');
  fireEvent.click(button);
  expect(mockOpenFn).toHaveBeenCalled();
});

test('does not render title or spaces when spaces array sleepingArrangements is empty', () => {
  render(
    <ListingSleepingArrangements
      spaces={mockSpacesEmpty}
      lang="es"
      open={jest.fn()}
    />
  );
  const t = getTranslation('es');
  expect(
    screen.queryByText(t.listingDetail.sleepingArrangements.title)
  ).not.toBeInTheDocument();
  expect(screen.queryByText('Habitación 1')).not.toBeInTheDocument();
});
