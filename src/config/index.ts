import { defineConfig } from './theme';

export * from './theme';

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
