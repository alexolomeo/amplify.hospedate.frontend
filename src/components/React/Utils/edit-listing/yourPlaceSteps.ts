export const YOUR_PLACE_STEP_MAP = {
  'request-changes': 0,
  overview: 1,
  'photo-gallery': 2,
  title: 3,
  'property-type': 4,
  price: 5,
  availability: 6,
  capacity: 7,
  description: 8,
  amenities: 9,
  address: 10,
  booking: 11,
  'house-rules': 12,
  'guest-safety': 13,
  'cancellation-policy': 14,
  // 'custom-link': 15,
  preview: 16,
} as const;

export type StepSlug = keyof typeof YOUR_PLACE_STEP_MAP;

export const steps: { id: number; slug: StepSlug }[] = [
  { id: 1, slug: 'request-changes' },
  { id: 2, slug: 'photo-gallery' },
  { id: 3, slug: 'title' },
  { id: 4, slug: 'property-type' },
  { id: 5, slug: 'price' },
  { id: 6, slug: 'availability' },
  { id: 7, slug: 'capacity' },
  { id: 8, slug: 'description' },
  { id: 9, slug: 'amenities' },
  { id: 10, slug: 'address' },
  { id: 11, slug: 'booking' },
  { id: 12, slug: 'house-rules' },
  { id: 13, slug: 'guest-safety' },
  { id: 14, slug: 'cancellation-policy' },
  // { id: 15, slug: 'custom-link' },
];
