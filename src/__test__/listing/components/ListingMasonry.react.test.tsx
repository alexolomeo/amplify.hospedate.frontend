import { render, screen, fireEvent } from '@testing-library/react';
import type { PhotoListingDetail, Space } from '@/types/listing/space';
import { useModalParam } from '@/components/React/Hooks/useModalParam';
import ListingMasonry from '@/components/React/Listing/ListingMasonry';
import { GalleryContainer } from '@/components/React/Listing/GalleryContainer';

const mockPhoto: PhotoListingDetail = {
  original: 'photo1.jpg',
  caption: 'Test photo',
  order: 1,
  srcsetWebp: 'photo1.webp 1200w',
  srcsetAvif: 'photo1.avif 1200w',
};

const mockSpace: Space = {
  id: 1,
  isDefault: false,
  name: 'Luxury Suite',
  photos: Array(10).fill(mockPhoto),
  amenities: [],
};

jest.mock('@/components/React/Hooks/useModalParam');

describe('ListingMasonry Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation for useModalParam
    (useModalParam as jest.Mock).mockReturnValue({
      isOpen: false,
      open: jest.fn(),
      close: jest.fn(),
    });
  });

  test('Shows message when no photos are available', () => {
    render(<ListingMasonry spaces={[]} lang="es" open={jest.fn()} />);
    expect(
      screen.getByText(/No hay imágenes disponibles/i)
    ).toBeInTheDocument();
  });

  test('Shows maximum 5 photos initially', async () => {
    render(<ListingMasonry spaces={[mockSpace]} open={jest.fn()} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(5);
  });

  test('Shows "View all photos" button', () => {
    render(<ListingMasonry spaces={[mockSpace]} lang="es" open={jest.fn()} />);
    expect(screen.getByTestId('test-button-view-photos')).toBeInTheDocument();
  });

  test('Opens modal when button is clicked', () => {
    const mockOpenFn = jest.fn();
    render(<ListingMasonry spaces={[mockSpace]} lang="es" open={mockOpenFn} />);
    const button = screen.getByTestId('test-button-view-photos');
    fireEvent.click(button);
    expect(mockOpenFn).toHaveBeenCalled();
  });

  test('Renders modal when isOpen is true', () => {
    // Setup modal in open state
    (useModalParam as jest.Mock).mockReturnValue({
      isOpen: true,
      open: jest.fn(),
      close: jest.fn(),
    });

    render(<GalleryContainer spaces={[mockSpace]} lang="es" />);
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });

  test('Closes modal when close button is clicked', () => {
    const mockCloseFn = jest.fn();
    (useModalParam as jest.Mock).mockReturnValue({
      isOpen: true,
      open: jest.fn(),
      close: mockCloseFn,
    });

    render(<GalleryContainer spaces={[mockSpace]} lang="es" />);
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(mockCloseFn).toHaveBeenCalled();
  });
});
