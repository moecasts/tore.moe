/**
 * ==================== Type Definitions ====================
 */

/**
 * Site basic info type
 */
export interface SiteConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  language?: string;
  timezone?: string;
  url?: string;
  root?: string;
  separator?: string;
  copyright?: string;
}

/**
 * Index page config type
 */
export interface IndexGeneratorConfig {
  path?: string;
  perPage?: number;
  orderBy?: string;
}

/**
 * Category and tag config type
 */
export interface MenuItem {
  id: string;
  name: string;
  href?: string;
  icon?: string;
  children?: MenuItem[];
}

export interface MenuConfig extends Array<MenuItem> {}

/**
 * Localized config type - supports both direct config and locale-specific config
 */
export type LocalizedConfig<T> = T | { [locale: string]: T };

/**
 * Type guard to check if config is localized
 */
function isLocalizedConfig<T>(
  config: LocalizedConfig<T> | undefined
): config is { [locale: string]: T } {
  if (!config || typeof config !== 'object') return false;
  if (Array.isArray(config)) return false;
  const keys = Object.keys(config);
  return keys.length > 0 && keys.some((key) => key.includes('-'));
}

/**
 * Metadata config type
 */
export interface MetaConfig {
  metaGenerator?: boolean;
}

/**
 * Date time format config type
 */
export interface DateTimeConfig {
  dateFormat?: string;
  timeFormat?: string;
  updatedOption?: string;
}

/**
 * Pagination config type
 */
export interface PaginationConfig {
  pageSize?: number;
  orderBy?: string;
  prefix?: string;
}

/**
 * Profile config type
 */
export interface ProfileConfig {
  name?: string;
  avatar?: string;
  email?: string;
  github?: string;
  bio?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

/**
 * Full theme config type
 */
export interface FullThemeConfig {
  site?: LocalizedConfig<SiteConfig>;
  profile?: LocalizedConfig<ProfileConfig>;
  menu?: LocalizedConfig<MenuConfig>;
  meta?: MetaConfig;
  datetime?: DateTimeConfig;
  pagination?: PaginationConfig;
}

/**
 * ==================== Config Implementation ====================
 */

/**
 * Full theme config object
 */
export let themeConfig: FullThemeConfig = {};

/**
 * Get localized value from config
 */
function getLocalizedValue<T>(
  config: LocalizedConfig<T> | undefined,
  locale: string
): T | undefined {
  if (!config) return undefined;

  if (isLocalizedConfig(config)) {
    const localizedConfig = config as {
      [locale: string]: T;
    };
    // Try exact match first
    if (localizedConfig[locale]) return localizedConfig[locale];

    // Try language-only match (e.g., 'zh' from 'zh-CN')
    const lang = locale.split('-')[0];
    const langMatch = Object.keys(localizedConfig).find((key) => key.startsWith(lang));
    if (langMatch) return localizedConfig[langMatch];

    // Fallback to first available locale
    const firstLocale = Object.keys(localizedConfig)[0];
    return localizedConfig[firstLocale];
  }

  return config as T;
}

/**
 * Get theme config for specific locale
 */
export function getThemeConfig(locale: string = 'zh-CN'): {
  site?: SiteConfig;
  profile?: ProfileConfig;
  menu?: MenuConfig;
  meta?: MetaConfig;
  datetime?: DateTimeConfig;
  pagination?: PaginationConfig;
} {
  return {
    site: getLocalizedValue(themeConfig.site, locale),
    profile: getLocalizedValue(themeConfig.profile, locale),
    menu: getLocalizedValue(themeConfig.menu, locale),
    meta: themeConfig.meta,
    datetime: themeConfig.datetime,
    pagination: themeConfig.pagination,
  };
}

/**
 * defineConfig function, provides type hints and validation
 */
export function defineConfig(config: Partial<FullThemeConfig> = {}): FullThemeConfig {
  themeConfig = {
    ...config,
  };
  return themeConfig;
}

/**
 * Custom config
 *
 * Note: site, profile, and menu support both direct config and locale-specific config:
 *
 * 1. Direct config (all locales use the same config):
 *    site: { title: 'My Site', ... }
 *
 * 2. Locale-specific config:
 *    site: {
 *      'zh-CN': { title: '我的网站', ... },
 *      'en-US': { title: 'My Site', ... }
 *    }
 */
defineConfig({
  /**
   * Site basic info
   */
  site: {
    title: '荡れ',
    description: '蕩れ（とれ）とは、萌えの一段階上の言葉である。',
    keywords: ['荡漾', '萌', '二次元', 'Caster', 'MoeCasts', 'Moe', 'ToRe'],
    author: 'Caster',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    url: 'https://www.tore.moe',
    root: '/',
    separator: ' - ',
    copyright: '© 2019 • Caster',
  },

  profile: {
    name: 'Caster',
    avatar: '/images/avatar.jpg',
    bio: '「生まれて、すみません」',
    email: 'moecasts.caster@gmail.com',
    github: 'https://github.com/moecasts',
  },

  /**
   * Category and tag config
   */
  menu: {
    'zh-CN': [
      {
        id: 'home',
        href: '/',
        name: '主页',
        icon: 'icon-[tabler--home-2]',
      },
      {
        id: 'coding',
        href: '/categories/coding',
        name: '编程',
        icon: 'icon-[tabler--code]',
      },
      {
        id: 'portfolios',
        href: '/portfolios',
        name: '作品集',
        icon: 'icon-[tabler--briefcase]',
      },
      {
        id: 'entertainment',
        name: '娱乐',
        icon: 'icon-[tabler--sparkles]',
        children: [
          {
            id: 'bangumi',
            href: '/categories/bangumi',
            name: '补番',
            icon: 'icon-[tabler--device-tv-old]',
          },
          {
            id: 'novel',
            href: '/categories/novel',
            name: '小说',
            icon: 'icon-[tabler--book-2]',
          },
          {
            id: 'comic',
            href: '/categories/comic',
            name: '漫画',
            icon: 'icon-[tabler--books]',
          },
          {
            id: 'games',
            href: '/categories/games',
            name: '游戏',
            icon: 'icon-[tabler--device-gamepad-2]',
          },
          {
            id: 'drama',
            href: '/categories/drama',
            name: '日剧',
            icon: 'icon-[tabler--device-tv]',
          },
        ],
      },
    ],
    'en-US': [
      {
        id: 'home',
        href: '/',
        name: 'Home',
        icon: 'icon-[tabler--home-2]',
      },
      {
        id: 'coding',
        href: '/categories/coding',
        name: 'Coding',
        icon: 'icon-[tabler--code]',
      },
      {
        id: 'portfolios',
        href: '/portfolios',
        name: 'Portfolios',
        icon: 'icon-[tabler--briefcase]',
      },
      {
        id: 'entertainment',
        name: 'Entertainment',
        icon: 'icon-[tabler--sparkles]',
        children: [
          {
            id: 'bangumi',
            href: '/categories/bangumi',
            name: 'Anime',
            icon: 'icon-[tabler--device-tv-old]',
          },
          {
            id: 'novel',
            href: '/categories/novel',
            name: 'Novel',
            icon: 'icon-[tabler--book-2]',
          },
          {
            id: 'comic',
            href: '/categories/comic',
            name: 'Comic',
            icon: 'icon-[tabler--books]',
          },
          {
            id: 'games',
            href: '/categories/games',
            name: 'Games',
            icon: 'icon-[tabler--device-gamepad-2]',
          },
          {
            id: 'drama',
            href: '/categories/drama',
            name: 'Drama',
            icon: 'icon-[tabler--device-tv]',
          },
        ],
      },
    ],
  },

  /**
   * Metadata config
   */
  meta: {
    metaGenerator: true,
  },

  /**
   * Date time format config
   */
  datetime: {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    updatedOption: 'mtime',
  },

  /**
   * Pagination config
   */
  pagination: {
    pageSize: 10,
    orderBy: '-date',
    prefix: 'page',
  },
});
