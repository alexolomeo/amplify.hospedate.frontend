export const LISTING_MAX_CHARS = 500;
export const LONG_MAX_CHARS = 37500;

export type DescriptionForm = {
  listingDescription: string;
  propertyDescription: string;
  areasDescription: string;
  interactionDescription: string;
  additionalNotes: string;
};

export type DescriptionFieldErrors = Partial<{
  listingDescription: string;
  propertyDescription: string;
  areasDescription: string;
  interactionDescription: string;
  additionalNotes: string;
}>;

export type DescriptionValidationResult =
  | { ok: true }
  | { ok: false; errors: DescriptionFieldErrors };

export type DescriptionValidationMessages = {
  listing: {
    required: string;
    max: string;
  };
  property: { max: string };
  access: { max: string };
  interaction: { max: string };
  highlights: { max: string };
};

export function validateDescriptionForm(
  form: DescriptionForm,
  m: DescriptionValidationMessages
): DescriptionValidationResult {
  const errors: DescriptionFieldErrors = {};

  const listing = form.listingDescription ?? '';
  const property = form.propertyDescription ?? '';
  const access = form.areasDescription ?? '';
  const interaction = form.interactionDescription ?? '';
  const highlights = form.additionalNotes ?? '';

  if (listing.trim().length === 0) {
    errors.listingDescription = m.listing.required;
  } else if (listing.length > LISTING_MAX_CHARS) {
    errors.listingDescription = m.listing.max;
  }

  if (property.length > LONG_MAX_CHARS) {
    errors.propertyDescription = m.property.max;
  }
  if (access.length > LONG_MAX_CHARS) {
    errors.areasDescription = m.access.max;
  }
  if (interaction.length > LONG_MAX_CHARS) {
    errors.interactionDescription = m.interaction.max;
  }
  if (highlights.length > LONG_MAX_CHARS) {
    errors.additionalNotes = m.highlights.max;
  }

  return Object.keys(errors).length === 0
    ? { ok: true }
    : { ok: false, errors };
}
