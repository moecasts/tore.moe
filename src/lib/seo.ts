import type { ProfileConfig, SiteConfig } from '@/config';
import { generateLanguageAlternates, getSupportedLocales } from './i18n';

export interface SEOContent {
  title?: string;
  description?: string;
  image?: string;
  date?: string | Date;
  updated?: string | Date;
  category?: string;
  tags?: string[];
}

export interface SEOConfig {
  content: SEOContent;
  config: {
    site?: SiteConfig;
    profile?: ProfileConfig;
  };
  locale: string;
  canonicalUrl: string;
  siteUrl: URL;
  i18n?: any; // i18next instance for language alternates
}

/**
 * Generate Open Graph image URL
 */
export function getOGImage(content: SEOContent, siteUrl: URL): string {
  if (content.image) {
    return new URL(content.image, siteUrl).toString();
  }

  // Try to get from environment variable
  const envOGImage = import.meta.env.PUBLIC_OG_DEFAULT_IMAGE;
  if (envOGImage) {
    return new URL(envOGImage, siteUrl).toString();
  }

  // Fallback to default
  return new URL('/images/og-default.jpg', siteUrl).toString();
}

/**
 * Check if content is an article
 */
export function isArticle(content: SEOContent): boolean {
  return Boolean(content.date || content.category);
}

/**
 * Generate article authors array
 */
export function getArticleAuthors(config: {
  site?: SiteConfig;
  profile?: ProfileConfig;
}): string[] {
  return [config.profile?.name || config.site?.author || ''];
}

/**
 * Generate page title with separator
 */
export function generateTitle(
  separator: string | undefined,
  contentTitle: string | undefined,
  siteTitle: string | undefined
): string {
  if (!contentTitle) return siteTitle || '';
  if (!siteTitle) return contentTitle;
  return `${contentTitle}${separator || ' - '}${siteTitle}`;
}

/**
 * Generate SEO meta tags configuration
 */
export function generateSEOProps(seoConfig: SEOConfig) {
  const { content, config, locale, canonicalUrl, siteUrl, i18n } = seoConfig;

  const title = generateTitle(config.site?.separator, content.title, config.site?.title);
  const description = content.description || config.site?.description || '';
  const ogImage = getOGImage(content, siteUrl);
  const articleType = isArticle(content);

  // Article metadata
  const publishedTime = content.date ? new Date(content.date).toISOString() : undefined;
  const modifiedTime = content.updated ? new Date(content.updated).toISOString() : undefined;
  const articleSection = content.category;
  const articleTags = content.tags || [];
  const articleAuthors = getArticleAuthors(config);

  // Generate language alternates if i18n is provided
  const languageAlternates = i18n
    ? generateLanguageAlternates(canonicalUrl, locale, getSupportedLocales(i18n))
    : undefined;

  const localeAlternate = (getSupportedLocales(i18n).filter((lang) => lang !== locale) || []).map(
    (lang) => lang.replace('-', '_')
  );

  return {
    title,
    description,
    canonical: canonicalUrl,
    charset: 'UTF-8' as const,
    languageAlternates,
    openGraph: {
      basic: {
        title: content.title || title,
        type: articleType ? ('article' as const) : ('website' as const),
        image: ogImage,
        url: canonicalUrl,
      },
      optional: {
        description: description,
        siteName: config.site?.title || '荡れ',
        locale: locale.replace('-', '_'),
        localeAlternate,
      },
      ...(articleType && {
        article: {
          publishedTime,
          modifiedTime,
          authors: articleAuthors,
          section: articleSection,
          tags: articleTags,
        },
      }),
      image: {
        alt: content.title || title,
        type: 'image/jpeg' as const,
        width: 1200,
        height: 630,
      },
    },
    twitter: {
      card: 'summary_large_image' as const,
      site: config.site?.title,
      title: content.title || title,
      description: description,
      image: ogImage,
      imageAlt: content.title || title,
    },
    extend: {
      link: [{ rel: 'icon', href: '/images/favicon.ico' }],
      meta: [
        // Basic meta tags
        { name: 'author', content: config.site?.author || '' },
        {
          name: 'keywords',
          content: (content.tags || config.site?.keywords || []).join(', '),
        },
        { name: 'robots', content: 'index, follow' },

        // Mobile optimization
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },

        // Theme colors
        { name: 'theme-color', content: import.meta.env.PUBLIC_THEME_COLOR || '#1f2937' },
        {
          name: 'msapplication-TileColor',
          content: import.meta.env.PUBLIC_THEME_COLOR || '#1f2937',
        },

        // Copyright
        { name: 'copyright', content: config.site?.copyright || '' },

        // Article specific meta tags
        ...(articleType
          ? [
              {
                property: 'article:author',
                content: config.profile?.name || 'Caster',
              },
              ...(publishedTime
                ? [
                    {
                      property: 'article:published_time',
                      content: publishedTime,
                    },
                  ]
                : []),
              ...(modifiedTime
                ? [
                    {
                      property: 'article:modified_time',
                      content: modifiedTime,
                    },
                  ]
                : []),
              ...(articleSection ? [{ property: 'article:section', content: articleSection }] : []),
              ...articleTags.map((tag: string) => ({
                property: 'article:tag',
                content: tag,
              })),
            ]
          : []),
      ],
    },
  };
}
