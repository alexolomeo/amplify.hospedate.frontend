import { render, screen } from '@testing-library/react';
import type { Rating } from '@/types/listing/rating';
import { getTranslation } from '@/utils/i18n';
import RatingCategory from '@/components/React/Listing/RatingCategory';

const mockRating: Rating = {
  ratingCategories: {
    cleanliness: 4.5,
    accuracy: 4.0,
    checkIn: 4.8,
    communication: 4.9,
    location: 4.6,
    value: 4.2,
  },
  score: 2.31,
  overallRating: [],
};

test('should render CompactCard correctly when not in modal', () => {
  render(<RatingCategory rating={mockRating} isModal={false} lang="es" />);
  expect(screen.getAllByTestId(/^compact-card-/)).toHaveLength(6);
});

test('should render RowCard and CompactCard correctly in modal mode', () => {
  render(<RatingCategory rating={mockRating} isModal={true} lang="es" />);
  expect(screen.getAllByTestId(/^row-card-/)).toHaveLength(6);
  expect(screen.getAllByTestId(/^compact-card-/)).toHaveLength(6);
});

test('should display label and value for each category correctly', () => {
  render(<RatingCategory rating={mockRating} lang="es" isModal={false} />);
  const t = getTranslation('es');
  expect(
    screen.getByText(t.listingDetail.rating.categories.cleanliness)
  ).toBeInTheDocument();
  expect(screen.getByText('4.5')).toBeInTheDocument();
  expect(
    screen.getByText(t.listingDetail.rating.categories.accuracy)
  ).toBeInTheDocument();
  expect(screen.getByText('4.0')).toBeInTheDocument();
  expect(
    screen.getByText(t.listingDetail.rating.categories.checkIn)
  ).toBeInTheDocument();
  expect(screen.getByText('4.8')).toBeInTheDocument();
  expect(
    screen.getByText(t.listingDetail.rating.categories.communication)
  ).toBeInTheDocument();
  expect(screen.getByText('4.9')).toBeInTheDocument();
  expect(
    screen.getByText(t.listingDetail.rating.categories.location)
  ).toBeInTheDocument();
  expect(screen.getByText('4.6')).toBeInTheDocument();
  expect(
    screen.getByText(t.listingDetail.rating.categories.value)
  ).toBeInTheDocument();
  expect(screen.getByText('4.2')).toBeInTheDocument();
});
