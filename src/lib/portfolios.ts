import { type CollectionEntry, getCollection } from 'astro:content';
import { buildStaticPaths } from 'astro-react-i18next/utils';
import { themeConfig } from '../config';

/**
 * Portfolio type with link
 */
export type PortfolioWithLink = CollectionEntry<'portfolios'> & { link: string };

/**
 * Get pagination configuration
 */
export function getPaginationConfig() {
  return {
    pageSize: themeConfig.pagination?.pageSize ?? 9,
    orderBy: themeConfig.pagination?.orderBy ?? '-date',
    prefix: themeConfig.pagination?.prefix ?? 'page',
  };
}

/**
 * Get all portfolios sorted by configuration with pin priority
 */
export async function getSortedPortfolios(): Promise<CollectionEntry<'portfolios'>[]> {
  const portfolios = await getCollection('portfolios');
  const { orderBy } = getPaginationConfig();
  const orderField = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
  const isDesc = orderBy.startsWith('-');

  return portfolios.sort((a, b) => {
    // Priority 1: Pin status (pinned items first)
    const aPinned = a.data.pin === true;
    const bPinned = b.data.pin === true;

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    // Priority 2: Date sorting within same pin status
    const av = new Date(a.data[orderField as 'date'] || 0).getTime();
    const bv = new Date(b.data[orderField as 'date'] || 0).getTime();
    return isDesc ? bv - av : av - bv;
  });
}

/**
 * Add standard link property to portfolios array
 */
export function addLinksToItems(portfolios: CollectionEntry<'portfolios'>[]): PortfolioWithLink[] {
  return portfolios.map((p) => ({
    ...p,
    link: `/portfolios/${p.data.slug ?? p.slug}`,
  }));
}

/**
 * Pagination paths options interface
 */
export interface PaginationPathsOptions {
  /** Portfolios array with links */
  portfolios: PortfolioWithLink[];
  /** Base parameters object, e.g. { tag: 'react' } */
  baseParams?: Record<string, any>;
  /** Locales paths configuration */
  localesPaths?: any[];
}

/**
 * Generic pagination path generator
 * Generate paginated paths for Astro's getStaticPaths, supports multi-language and custom parameters
 * First page has no page parameter, subsequent pages are set to 'page/2', 'page/3', etc.
 */
export function generatePaginationPaths(
  { paginate }: { paginate: any },
  { portfolios, baseParams = {}, localesPaths }: PaginationPathsOptions
) {
  const { pageSize, prefix } = getPaginationConfig();

  const targetPaths = localesPaths || [{ params: {} }];

  return targetPaths.flatMap((localePath: any) => {
    const paginatedResults = paginate(portfolios, {
      params: { ...baseParams, ...localePath.params },
      pageSize,
    });

    return paginatedResults.map((result: any) => {
      const pageNum = result.props.page.currentPage;
      return {
        ...result,
        params: {
          ...result.params,
          page: pageNum === 1 ? undefined : `${prefix}/${pageNum}`,
        },
      };
    });
  });
}

/**
 * Generate static paths for portfolios pagination
 * Used for generating paginated routes for portfolios list, supports multi-language
 */
export async function getPortfoliosStaticPaths({ paginate }: { paginate: any }) {
  const sortedPortfolios = await getSortedPortfolios();
  const portfoliosWithLinks = addLinksToItems(sortedPortfolios);
  const localesPaths = buildStaticPaths();

  return generatePaginationPaths(
    { paginate },
    {
      portfolios: portfoliosWithLinks,
      localesPaths,
    }
  );
}

/**
 * Get all tags used in portfolios, deduplicated
 */
export async function getAllTags(): Promise<string[]> {
  const portfolios = await getSortedPortfolios();
  const allTags = new Set<string>();

  for (const portfolio of portfolios) {
    for (const tag of portfolio.data.tags ?? []) {
      allTags.add(String(tag));
    }
  }

  return Array.from(allTags);
}

/**
 * Filter portfolios by tag
 */
export function filterPortfoliosByTag(
  portfolios: CollectionEntry<'portfolios'>[],
  tag: string
): CollectionEntry<'portfolios'>[] {
  return portfolios.filter((portfolio) => (portfolio.data.tags ?? []).includes(tag));
}

/**
 * Generate static paths for tag page pagination
 * Generate corresponding paginated routes for each tag
 */
export async function getTagStaticPaths({ paginate }: { paginate: any }) {
  const sortedPortfolios = await getSortedPortfolios();
  const allTags = await getAllTags();

  return allTags.flatMap((tag) => {
    const filteredPortfolios = filterPortfoliosByTag(sortedPortfolios, tag);
    const portfoliosWithLinks = addLinksToItems(filteredPortfolios);

    return generatePaginationPaths(
      { paginate },
      {
        portfolios: portfoliosWithLinks,
        baseParams: { tag },
      }
    );
  });
}
