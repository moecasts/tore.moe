/**
 * Utility library exports for theme customization
 * Users can import and use these utilities in their projects
 */

// Content utilities
export { extractDescription } from './description';

// i18n utilities
export {
  generateLanguageAlternates,
  getOGLocale,
  getOGLocaleAlternates,
  getSupportedLocales,
} from './i18n';
// Menu utilities
export { findMenuItemByHref, findMenuItemById, flattenMenuItems, getFlattenedMenu } from './menu';
// Path utilities
export { normalize } from './normalize';
// Pagination utilities
export { buildPager } from './pagination';
// Portfolio utilities
export {
  addLinksToItems as addLinksToPortfolioItems,
  filterPortfoliosByTag,
  getAllTags as getAllPortfolioTags,
  getPaginationConfig as getPortfolioPaginationConfig,
  getPortfoliosStaticPaths,
  getSortedPortfolios,
  getTagStaticPaths as getPortfolioTagStaticPaths,
} from './portfolios';
// Post utilities
export {
  addLinksToItems as addLinksToPostItems,
  filterPostsByCategory,
  filterPostsByTag as filterPostsByPostTag,
  getAllCategories,
  getAllTags as getAllPostTags,
  getCategoryStaticPaths,
  getMainPageStaticPaths,
  getPaginationConfig as getPostPaginationConfig,
  getSortedPosts,
  getTagStaticPaths as getPostTagStaticPaths,
} from './posts';
// String utilities
export { print } from './print';

// Scroll utilities
export {
  easeInOutCubic,
  easeInOutQuad,
  easeOutCubic,
  easeOutQuart,
  scrollTo,
  scrollToBottom,
  scrollToElement,
  scrollToPosition,
  scrollToTop,
} from './scroll-to';
// SEO utilities
export {
  generateSEOProps,
  generateTitle,
  getArticleAuthors,
  getOGImage,
  isArticle,
  type SEOConfig,
  type SEOContent,
} from './seo';
export { unescapeHtml } from './unescape-html';

// Style utilities
export { cn } from './utils';
