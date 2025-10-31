import {
  isValidSlug,
  type Slug,
} from '@/components/React/Utils/edit-listing/slugs';

export function parseEditRoute(
  pathname: string,
  listingId: string
): { slug: Slug; subpath: string } {
  const encodedId = encodeURIComponent(listingId);
  const bases = [
    `/hosting/listing/edit/${encodedId}/`,
    `/hosting/listing/edit/${listingId}/`,
  ];

  let raw = 'overview';
  for (const base of bases) {
    const idx = pathname.indexOf(base);
    if (idx >= 0) {
      raw = pathname.slice(idx + base.length);
      break;
    }
  }

  const [slugFirst, ...rest] = raw.split('/');
  const nextSlug: Slug = isValidSlug(slugFirst)
    ? (slugFirst as Slug)
    : 'overview';
  const subpath = nextSlug === 'photo-gallery' ? rest.join('/') : '';
  return { slug: nextSlug, subpath };
}
