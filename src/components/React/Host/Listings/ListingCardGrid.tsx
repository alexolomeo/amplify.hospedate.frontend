import React, { useMemo } from 'react';
import { navigate } from 'astro:transitions/client';
import ListingCard from '@/components/React/Host/Listings/ListingCard';
import type { Listing } from '@/types/host/listing';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import clsx from 'clsx';
import { parseISO } from 'date-fns';
import { resolveHref } from '@/components/React/Utils/host/listings/navigation';

interface Props {
  searchTerm: string;
  listings: Listing[];
  lang?: SupportedLanguages;
}

export default function ListingCardGrid({
  searchTerm,
  listings,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);

  const filteredAndSorted = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return listings
      .filter((listing) => {
        const title = listing.title || listing.propertyType;
        const locationStr = listing.location
          ? `${listing.location.address} ${listing.location.city} ${listing.location.state} ${listing.location.country}`
          : '';
        return `${title} ${locationStr}`.toLowerCase().includes(term);
      })
      .slice()
      .sort((a, b) => {
        const dateA = parseISO(a.createdAt).getTime();
        const dateB = parseISO(b.createdAt).getTime();
        return dateB - dateA;
      });
  }, [listings, searchTerm]);

  const handleKey = (e: React.KeyboardEvent, href: string | null) => {
    if (!href) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {filteredAndSorted.map((listing) => {
        const href = resolveHref(listing);
        const isActionable = Boolean(href);

        return (
          <div
            key={listing.id}
            className={clsx(isActionable && 'cursor-pointer')}
            onClick={isActionable ? () => navigate(href!) : undefined}
            role={isActionable ? 'button' : undefined}
            tabIndex={isActionable ? 0 : -1}
            onKeyDown={(e) => handleKey(e, href)}
            aria-disabled={!isActionable}
          >
            <ListingCard data={listing} lang={lang} />
          </div>
        );
      })}

      {filteredAndSorted.length === 0 && (
        <div className="col-span-full text-sm text-gray-400">
          {t.hostContent.listings.noResults}
        </div>
      )}
    </div>
  );
}
