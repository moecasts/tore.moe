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
/**
 * About page config type
 */

// Timeline item type
export interface TimelineItem {
  period: string;
  title: string;
  company: string | { icon?: string; name: string };
  /**
   * support markdown
   */
  description: string | string[];
}

// Skill category type
export interface SkillCategory {
  category: string;
  icon?: string; // 'code' | 'server' | 'cloud' or custom image URL
  skills: (string | { name: string; icon?: string })[];
}

// Social link type
export interface SocialLink {
  name: string;
  url: string;
  icon:
    | 'Github'
    | 'Linkedin'
    | 'Twitter'
    | 'Instagram'
    | 'Facebook'
    | 'Youtube'
    | 'Mail'
    | 'Globe'
    | string; // Predefined icons or custom icon class
}

// Hero section - for page header with large title and description
export interface HeroSection {
  type: 'hero';
  title: string;
  /**
   * support markdown
   */
  content: string;
}

// Text section - supports single or multiple paragraphs
export interface TextSection {
  type: 'text';
  title: string;
  /**
   * support markdown
   */
  content: string | string[];
}

// Skills section - for skill categories with icons
export interface SkillsSection {
  type: 'skills';
  title: string;
  content: SkillCategory[];
}

// List section - for simple bullet point lists
export interface ListSection {
  type: 'list';
  title: string;
  content: string[];
}

// Timeline section - for experience, education, etc.
export interface TimelineSection {
  type: 'timeline';
  title: string;
  content: TimelineItem[];
}

// Social links section - for social media and contact links
export interface SocialLinksSection {
  type: 'social';
  title: string;
  description?: string | string[];
  content: SocialLink[];
}

// Separator section - for visual separation between sections
export interface SeparatorSection {
  type: 'separator';
}

// Union type for all section types
export type AboutSection =
  | HeroSection
  | TextSection
  | SkillsSection
  | ListSection
  | TimelineSection
  | SocialLinksSection
  | SeparatorSection;

export interface AboutConfig extends Array<AboutSection> {}

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
  about?: LocalizedConfig<AboutConfig>;
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
  about?: AboutConfig;
  meta?: MetaConfig;
  datetime?: DateTimeConfig;
  pagination?: PaginationConfig;
} {
  return {
    site: getLocalizedValue(themeConfig.site, locale),
    profile: getLocalizedValue(themeConfig.profile, locale),
    menu: getLocalizedValue(themeConfig.menu, locale),
    about: getLocalizedValue(themeConfig.about, locale),
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
