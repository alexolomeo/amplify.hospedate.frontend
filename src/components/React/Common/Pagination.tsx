import React from 'react';
import clsx from 'clsx';

type PageItem = number | 'dots';

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
}: PaginationProps) {
  const getPageItems = (): PageItem[] => {
    // totalPageNumbers is the total number of page items to show without dots:
    // - siblingCount * 2: pages on each side of the current page
    // - boundaryCount * 2: pages at the start and end
    const totalPageNumbers = siblingCount * 2 + boundaryCount * 2 + 1 + 2;
    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(
      currentPage - siblingCount,
      boundaryCount + 2
    );
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages - boundaryCount - 1
    );

    const showLeftDots = leftSiblingIndex > boundaryCount + 2;
    const showRightDots = rightSiblingIndex < totalPages - boundaryCount - 1;

    const pages: PageItem[] = [];

    pages.push(...range(1, boundaryCount));

    if (showLeftDots) {
      pages.push('dots');
    } else {
      pages.push(...range(boundaryCount + 1, leftSiblingIndex - 1));
    }

    pages.push(...range(leftSiblingIndex, rightSiblingIndex));

    if (showRightDots) {
      pages.push('dots');
    } else {
      pages.push(...range(rightSiblingIndex + 1, totalPages - boundaryCount));
    }

    pages.push(...range(totalPages - boundaryCount + 1, totalPages));

    return pages;
  };

  const items = getPageItems();

  if (totalPages < 2) return null;

  return (
    <nav className="flex items-start overflow-hidden rounded-lg bg-transparent">
      {items.map((item, idx) => {
        if (item === 'dots') {
          return (
            <span
              key={`dots-${idx}`}
              className="text-base-content flex h-8 items-center justify-center px-3.5 text-sm font-semibold"
            >
              …
            </span>
          );
        }
        const page = item as number;
        const isSelected = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isSelected}
            className={clsx(
              'flex h-8 cursor-pointer items-center justify-center px-3.5 text-sm font-semibold shadow-sm',
              'first:rounded-l-lg last:rounded-r-lg',
              isSelected
                ? 'bg-primary text-primary-content'
                : 'bg-base-200 text-base-content border-base-200 border-r',
              idx === items.length - 1 || items[idx + 1] === 'dots'
                ? 'border-r-0'
                : ''
            )}
          >
            {page}
          </button>
        );
      })}
    </nav>
  );
}
