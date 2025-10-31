'use client';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import type { Listing } from '@/types/host/listing';
import ChevronUpDownMini from '@/icons/chevron-up-down-mini.svg?react';
import clsx from 'clsx';
import StatusBadge from '@/components/React/Host/Listings/StatusBadge';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { ResponsiveImage } from '../../Common/ResponsiveImage';
import { navigate } from 'astro:transitions/client';
import AppButton from '@/components/React/Common/AppButton';
import { parseISO, format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { resolveHref } from '@/components/React/Utils/host/listings/navigation';

interface Props {
  listings: Listing[];
  searchTerm: string;
  lang?: SupportedLanguages;
}

export default function ListingTable({
  listings,
  searchTerm,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);

  const data = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();

    return listings.filter((listing) => {
      const title = listing.title?.toLowerCase() ?? '';
      const location = listing.location
        ? `${listing.location.address} ${listing.location.city} ${listing.location.state} ${listing.location.country}`.toLowerCase()
        : '';

      return title.includes(lowerSearch) || location.includes(lowerSearch);
    });
  }, [listings, searchTerm]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);

  const columns = useMemo<ColumnDef<Listing>[]>(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <button
            onClick={column.getToggleSortingHandler()}
            className="text-base-content flex items-center gap-1 text-xs font-bold"
          >
            <ChevronUpDownMini
              className={clsx(
                'h-4 w-4',
                column.getIsSorted() === 'asc' && 'text-primary rotate-180',
                column.getIsSorted() === 'desc' && 'text-primary',
                !column.getIsSorted() && 'opacity-50'
              )}
            />
            {t.hostContent.listings.table.title}
          </button>
        ),
        enableSorting: true,
        cell: ({ row }) => {
          const { title, photo } = row.original;
          const fallbackPhoto = {
            original: '/images/host/listings/fallback-card-image.webp',
            srcsetWebp: '',
            srcsetAvif: '',
          };

          return (
            <div className="flex items-center gap-3">
              <div className="bg-base-200 h-12 w-12 flex-shrink-0 overflow-hidden rounded-[16px]">
                <ResponsiveImage
                  photo={photo || fallbackPhoto}
                  alt={title ?? t.hostContent.listings.table.noTitle}
                  className="h-full w-full object-cover"
                  sizes="48px"
                />
              </div>
              <span className="line-clamp-2 self-center text-sm">
                {title?.trim() || t.hostContent.listings.table.noInformation}
              </span>
            </div>
          );
        },
      },
      {
        id: 'location',
        header: ({ column }) => (
          <button
            onClick={column.getToggleSortingHandler()}
            className="text-base-content flex items-center gap-1 text-xs font-bold"
          >
            <ChevronUpDownMini
              className={clsx(
                'h-4 w-4',
                column.getIsSorted() === 'asc' && 'text-primary rotate-180',
                column.getIsSorted() === 'desc' && 'text-primary',
                !column.getIsSorted() && 'opacity-50'
              )}
            />
            {t.hostContent.listings.table.location}
          </button>
        ),
        accessorFn: (row) => {
          if (!row.location) return t.hostContent.listings.table.noInformation;
          const parts = [row.location.address, row.location.city].filter(
            Boolean
          );
          return parts.length > 0
            ? parts.join(', ')
            : t.hostContent.listings.table.noInformation;
        },
        enableSorting: true,
        cell: ({ getValue }) => getValue<string>(),
      },
      {
        id: 'createdAt',
        header: ({ column }) => (
          <button
            onClick={column.getToggleSortingHandler()}
            className="text-base-content flex items-center gap-1 text-xs font-bold"
          >
            <ChevronUpDownMini
              className={clsx(
                'h-4 w-4',
                column.getIsSorted() === 'asc' && 'text-primary rotate-180',
                column.getIsSorted() === 'desc' && 'text-primary',
                !column.getIsSorted() && 'opacity-50'
              )}
            />
            {t.hostContent.listings.table.createdAt}
          </button>
        ),
        accessorFn: (row) =>
          row.createdAt ? parseISO(row.createdAt).getTime() : 0,
        enableSorting: true,
        cell: ({ row }) => {
          const raw = row.original.createdAt;
          if (!raw) return t.hostContent.listings.table.noInformation;
          const d = parseISO(raw);
          return format(d, 'dd/MM/yyyy', { locale: lang === 'en' ? enUS : es });
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <button
            onClick={column.getToggleSortingHandler()}
            className="text-base-content flex items-center gap-1 text-xs font-bold"
          >
            <ChevronUpDownMini
              className={clsx(
                'h-4 w-4',
                column.getIsSorted() === 'asc' && 'text-primary rotate-180',
                column.getIsSorted() === 'desc' && 'text-primary',
                !column.getIsSorted() && 'opacity-50'
              )}
            />
            {t.hostContent.listings.table.status}
          </button>
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} lang={lang} />
        ),
      },
      {
        id: 'actions',
        header: () => (
          <span className="text-base-content text-xs font-bold">
            {t.hostContent.listings.table.actions}
          </span>
        ),
        cell: ({ row }) => {
          const href = resolveHref(row.original);
          if (!href) return null;

          return (
            <AppButton
              variant="link"
              size="sm"
              label={t.hostContent.listings.table.view}
              onClick={() => navigate(href)}
            />
          );
        },
      },
    ],
    [
      lang,
      t.hostContent.listings.table.actions,
      t.hostContent.listings.table.createdAt,
      t.hostContent.listings.table.location,
      t.hostContent.listings.table.noInformation,
      t.hostContent.listings.table.noTitle,
      t.hostContent.listings.table.status,
      t.hostContent.listings.table.title,
      t.hostContent.listings.table.view,
    ]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="overflow-hidden rounded-xl border border-transparent">
      {data.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center text-sm text-gray-400">
          {t.hostContent.listings.noResults}
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-primary-content">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-base-content px-4 py-2 text-xs font-bold"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-base-300 text-base-content border-b text-sm"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
