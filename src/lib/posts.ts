import { type CollectionEntry, getCollection } from 'astro:content';
import { buildStaticPaths } from 'astro-react-i18next/utils';
import { themeConfig } from '../config';
import { getFlattenedMenu } from './menu';

/**
 * Post type with link
 */
export type PostWithLink = CollectionEntry<'posts'> & { link: string };

/**
 * Get pagination configuration
 */
export function getPaginationConfig() {
  return {
    pageSize: themeConfig.pagination?.pageSize ?? 10,
    orderBy: themeConfig.pagination?.orderBy ?? '-date',
    prefix: themeConfig.pagination?.prefix ?? 'page',
  };
}

/**
 * Get all posts sorted by configuration
 */
export async function getSortedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts');
  const { orderBy } = getPaginationConfig();
  const orderField = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
  const isDesc = orderBy.startsWith('-');

  return posts.sort((a, b) => {
    const av = new Date(a.data[orderField as 'date'] || 0).getTime();
    const bv = new Date(b.data[orderField as 'date'] || 0).getTime();
    return isDesc ? bv - av : av - bv;
  });
}

/**
 * Add standard link property to posts array
 */
export function addLinksToItems(posts: CollectionEntry<'posts'>[]): PostWithLink[] {
  return posts.map((p) => ({
    ...p,
    link: `/posts/${p.data.slug ?? p.slug}`,
  }));
}

/**
 * Pagination paths options interface
 */
export interface PaginationPathsOptions {
  /** Posts array with links */
  posts: PostWithLink[];
  /** Base parameters object, e.g. { tag: 'javascript' } */
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
  { posts, baseParams = {}, localesPaths }: PaginationPathsOptions
) {
  const { pageSize, prefix } = getPaginationConfig();

  const targetPaths = localesPaths || [{ params: {} }];

  return targetPaths.flatMap((localePath: any) => {
    const paginatedResults = paginate(posts, {
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
 * Generate static paths for homepage pagination
 * Used for generating paginated routes for homepage list, supports multi-language
 */
export async function getMainPageStaticPaths({ paginate }: { paginate: any }) {
  const sortedPosts = await getSortedPosts();
  const postsWithLinks = addLinksToItems(sortedPosts);
  const localesPaths = buildStaticPaths();

  return generatePaginationPaths(
    { paginate },
    {
      posts: postsWithLinks,
      localesPaths,
    }
  );
}

/**
 * Get all tags used in posts, deduplicated
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getSortedPosts();
  const allTags = new Set<string>();

  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      allTags.add(String(tag));
    }
  }

  return Array.from(allTags);
}

/**
 * Filter posts by tag
 */
export function filterPostsByTag(
  posts: CollectionEntry<'posts'>[],
  tag: string
): CollectionEntry<'posts'>[] {
  return posts.filter((post) => (post.data.tags ?? []).includes(tag));
}

/**
 * Generate static paths for tag page pagination
 * Generate corresponding paginated routes for each tag
 */
export async function getTagStaticPaths({ paginate }: { paginate: any }) {
  const sortedPosts = await getSortedPosts();
  const allTags = await getAllTags();

  return allTags.flatMap((tag) => {
    const filteredPosts = filterPostsByTag(sortedPosts, tag);
    const postsWithLinks = addLinksToItems(filteredPosts);

    return generatePaginationPaths(
      { paginate },
      {
        posts: postsWithLinks,
        baseParams: { tag },
      }
    );
  });
}

/**
 * Get all categories from theme config, returned in lowercase
 * Note: This function gets categories from all locales to ensure all category pages are generated
 */
export function getAllCategories(): string[] {
  // Get categories from both locales to ensure all pages are generated
  const locales = ['zh-CN', 'en-US'];
  const allCategories = new Set<string>();
  
  for (const locale of locales) {
    const flattenedMenu = getFlattenedMenu(locale);
    flattenedMenu
      .filter((item) => item && (item.href?.startsWith('/categories/') || item.id))
      .map((item) => String(item.id || '').toLowerCase())
      .filter((id): id is string => Boolean(id))
      .forEach((id) => allCategories.add(id));
  }
  
  return Array.from(allCategories);
}

/**
 * Filter posts by category, case-insensitive
 */
export function filterPostsByCategory(
  posts: CollectionEntry<'posts'>[],
  category: string
): CollectionEntry<'posts'>[] {
  const categoryLower = category.toLowerCase();
  return posts.filter((post) =>
    (post.data.categories ?? []).map((c) => String(c).toLowerCase()).includes(categoryLower)
  );
}

/**
 * Generate static paths for category page pagination
 * Generate corresponding paginated routes for each category
 */
export async function getCategoryStaticPaths({ paginate }: { paginate: any }) {
  const posts = await getSortedPosts();
  const categories = getAllCategories();

  return categories.flatMap((category) => {
    const filteredPosts = filterPostsByCategory(posts, category);
    const postsWithLinks = addLinksToItems(filteredPosts);

    return generatePaginationPaths(
      { paginate },
      {
        posts: postsWithLinks,
        baseParams: { category },
      }
    );
  });
}
