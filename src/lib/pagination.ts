export type Pager = {
  // 'prev' | 'next' | 'ellipsis'
  type?: 'prev' | 'ellipsis' | 'next';
  // Page number exists in items without type
  page?: number;
  // Link address (prev/next/page number)
  link?: string;
  // Whether it's the current page
  active?: boolean;
  // Whether it's disabled (e.g. prev on first page, next on last page)
  disabled?: boolean;
};

/**
 * Generate pagination render array: includes prev/next, first/last pages, neighbor pages of current page, and necessary ellipsis.
 * - Always includes first and last pages
 * - Shows current page and 1 page before/after (configurable)
 * - Inserts ellipsis items when there are gaps (type: 'ellipsis')
 */
export function buildPager(
  currentPage: number,
  totalPages: number,
  makeHref: (page: number) => string,
  neighborCount: number = 1
): Pager[] {
  const safeCurrent = Math.min(Math.max(currentPage, 1), Math.max(1, totalPages));
  const pages: number[] = [];

  if (totalPages <= 0) return [];

  // Always show first and last
  pages.push(1);
  if (totalPages > 1) pages.push(totalPages);

  // Current page and neighbors
  for (let p = safeCurrent - neighborCount; p <= safeCurrent + neighborCount; p++) {
    if (p > 1 && p < totalPages) pages.push(p);
  }

  // Deduplicate and sort ascending
  const uniqueSorted = Array.from(new Set(pages)).sort((a, b) => a - b);

  const result: Pager[] = [];

  // prev
  result.push({
    type: 'prev',
    link: safeCurrent > 2 ? makeHref(safeCurrent - 1) : safeCurrent === 2 ? makeHref(1) : undefined,
    disabled: safeCurrent === 1,
  });

  // Insert ellipsis and page numbers in between
  for (let i = 0; i < uniqueSorted.length; i++) {
    const page = uniqueSorted[i];
    const prevPage = uniqueSorted[i - 1];
    if (i > 0 && page - (prevPage ?? page) > 1) {
      result.push({ type: 'ellipsis' });
    }
    result.push({
      page,
      link: makeHref(page),
      active: page === safeCurrent,
    });
  }

  // next
  result.push({
    type: 'next',
    link: safeCurrent < totalPages ? makeHref(safeCurrent + 1) : undefined,
    disabled: safeCurrent === totalPages,
  });

  return result;
}
