import { render, screen } from '@testing-library/react';
import type { PhotoListingDetail, Space } from '@/types/listing/space';
import ListingGallery from '@/components/React/Listing/ListingGallery';

describe('ListingGallery Component', () => {
  const mockPhoto: PhotoListingDetail = {
    original: 'photo1.jpg',
    caption: 'Test photo',
    order: 1,
    srcsetWebp: '300w.webp 300w, 600w.webp 600w',
    srcsetAvif: '300w.avif 300w, 600w.avif 600w',
  };

  const mockSpace: Space = {
    id: 1,
    isDefault: false,
    name: 'Luxury Suite',
    photos: [mockPhoto, { ...mockPhoto, original: 'photo2.jpg', order: 2 }],
    amenities: [
      { name: 'WiFi', icon: '', amenityGroup: '' },
      { name: 'Parking', icon: '', amenityGroup: '' },
    ],
  };
  const mockSpace2: Space = {
    id: 3,
    isDefault: false,
    name: 'room',
    photos: [mockPhoto, { ...mockPhoto, original: 'photo2.jpg', order: 2 }],
    amenities: [
      { name: 'Cook', icon: '', amenityGroup: '' },
      { name: 'air', icon: '', amenityGroup: '' },
    ],
  };

  test('Renders empty div when no spaces are provided', () => {
    render(<ListingGallery spaces={[]} />);
    expect(
      screen.getByText(/No hay imágenes disponibles/i)
    ).toBeInTheDocument();
  });

  test('Renders space name and amenities correctly', () => {
    render(<ListingGallery spaces={[mockSpace, mockSpace2]} />);
    expect(screen.getByText('Luxury Suite')).toBeInTheDocument();
    expect(screen.getByText('WiFi • Parking')).toBeInTheDocument();
  });

  test('Handles multiple spaces correctly', () => {
    const spaces = [
      mockSpace,
      {
        ...mockSpace,
        name: 'Garden View Room',
        amenities: [{ name: 'Garden View', icon: '', amenityGroup: '' }],
      },
    ];

    render(<ListingGallery spaces={spaces} />);

    expect(screen.getByText('Luxury Suite')).toBeInTheDocument();
    expect(screen.getByText('Garden View Room')).toBeInTheDocument();

    expect(screen.getByText('WiFi • Parking')).toBeInTheDocument();
    expect(screen.getByText('Garden View')).toBeInTheDocument();
  });
  test('No renderiza Lightbox inicialmente', () => {
    const { container } = render(<ListingGallery spaces={[mockSpace]} />);

    // Checks that the Lightbox main container doesn't exist
    const lightboxElement = container.querySelector('.yarl__container');
    expect(lightboxElement).not.toBeInTheDocument();
  });
});
