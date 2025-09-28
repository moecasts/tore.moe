// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import compress from '@playform/compress';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';
import type { AstroUserConfig } from 'astro';
import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';
import reactI18next from 'astro-react-i18next';
import rehypeMathjax from 'rehype-mathjax';
import rehypeMermaid from 'rehype-mermaid';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import { remarkMedia } from 'remark-media';

// Vite 插件来处理开发环境中的 pagefind 导入
function pagefindDevPlugin() {
  return {
    name: 'pagefind-dev',
    resolveId(id: string) {
      // 只在开发环境中处理
      if (process.env.NODE_ENV !== 'production' && id === '/pagefind/pagefind.js') {
        return id;
      }
    },
    load(id: string) {
      // 只在开发环境中提供 mock
      if (process.env.NODE_ENV !== 'production') {
        if (id === '/pagefind/pagefind.js') {
          return `
            export const init = () => Promise.resolve({});
          `;
        }
      }
    },
    /**
     *
     * @param {*} config
     */
    config(config: any) {
      // 在构建时将 pagefind 标记为外部依赖
      if (!config.build) config.build = {};
      if (!config.build.rollupOptions) config.build.rollupOptions = {};
      if (!config.build.rollupOptions.external) config.build.rollupOptions.external = [];

      const external = config.build.rollupOptions.external;
      if (Array.isArray(external)) {
        if (!external.includes('/pagefind/pagefind.js')) {
          external.push('/pagefind/pagefind.js');
        }
      }
    },
  };
}

// 固定重定向映射（由迁移脚本生成）
const FIXED_REDIRECTS: AstroUserConfig['redirects'] = {
  '/post/A-Megami-sama': { destination: '/posts/A-Megami-sama', status: 301 },
  '/post/Aho-Girl': { destination: '/posts/Aho-Girl', status: 301 },
  '/post/Akashic-Records-of-Bastard-Magical-Instructor': {
    destination: '/posts/Akashic-Records-of-Bastard-Magical-Instructor',
    status: 301,
  },
  '/post/Amagi-Brilliant-Park': { destination: '/posts/Amagi-Brilliant-Park', status: 301 },
  '/post/Arifureta-Shokugyou-de-Sekai-Saikyou': {
    destination: '/posts/Arifureta-Shokugyou-de-Sekai-Saikyou',
    status: 301,
  },
  '/post/Biri-Gyaru': { destination: '/posts/Biri-Gyaru', status: 301 },
  '/post/Black-Lagoon': { destination: '/posts/Black-Lagoon', status: 301 },
  '/post/Blast-of-Tempest': { destination: '/posts/Blast-of-Tempest', status: 301 },
  '/post/Buso-Shojo-Makyaverizumu': { destination: '/posts/Buso-Shojo-Makyaverizimu', status: 301 },
  '/post/Citrus': { destination: '/posts/Citrus', status: 301 },
  '/post/Computer-Network': { destination: '/posts/Computer-Network', status: 301 },
  '/post/Danchigai': { destination: '/posts/Danchigai', status: 301 },
  '/post/Danna-ga-Nani-o-Itteiru-ka-Wakaranai-Ken': {
    destination: '/posts/Danna-ga-Nani-o-Itteiru-ka-Wakaranai-Ken',
    status: 301,
  },
  '/post/Danshi-Kokosei-no-Nichijou': {
    destination: '/posts/Danshi-Kokosei-no-Nichijou',
    status: 301,
  },
  '/post/Death-March-kara-Hajimaru-Isekai-Kyousoukyoku': {
    destination: '/posts/Death-March-kara-Hajimaru-Isekai-Kyousoukyoku',
    status: 301,
  },
  '/post/Debiruzu-Rain': { destination: '/posts/Debiruzu-Rain', status: 301 },
  '/post/Devilman-Crybaby': { destination: '/posts/Devilman-Crybaby', status: 301 },
  '/post/Dropkick-on-My-Devil': { destination: '/posts/Dropkick-on-My-Devil', status: 301 },
  '/post/Furaingu-Uitchi': { destination: '/posts/Furaingu-Uitchi', status: 301 },
  '/post/Go-Tobun-no-Hanayome': { destination: '/posts/Go-Tobun-no-Hanayome', status: 301 },
  '/post/Goblin-Slayer': { destination: '/posts/Goblin-Slayer', status: 301 },
  '/post/Golden-Time': { destination: '/posts/Golden-Time', status: 301 },
  '/post/Gomenne-Seisyun': { destination: '/posts/Gomenne-Seisyun', status: 301 },
  '/post/GOSICK': { destination: '/posts/GOSICK', status: 301 },
  '/post/Grand-Masion-Tokyo': { destination: '/posts/Grand-Masion-Tokyo', status: 301 },
  '/post/HenShin': { destination: '/posts/HenShin', status: 301 },
  '/post/Hundred': { destination: '/posts/Hundred', status: 301 },
  '/post/ID-INVADED': { destination: '/posts/ID-INVADED', status: 301 },
  '/post/Isekai-Mao-to-Shokan-Shojo-no-Dorei-Majutsu': {
    destination: '/posts/Isekai-Mao-to-Shokan-Shojo-no-Dorei-Majutsu',
    status: 301,
  },
  '/post/Isekai-wa-Smartphone-Totomoni': {
    destination: '/posts/Isekai-wa-Smartphone-Totomoni',
    status: 301,
  },
  '/post/Ishuzoku-Rebyuazu': { destination: '/posts/Ishuzoku-Rebyuazu', status: 301 },
  '/post/Isshukan-furenzu': { destination: '/posts/Isshukan-furenzu', status: 301 },
  '/post/tai-no-wa-Iya-nano-de-Bogyoryoku-ni-Kyokufuri-Shitai-to-Omoimasu': {
    destination: '/posts/tai-no-wa-Iya-nano-de-Bogyoryoku-ni-Kyokufuri-Shitai-to-Omoimasu',
    status: 301,
  },
  '/post/Joshi-Kosei-no-Mudazukai': { destination: '/posts/Joshi-Kosei-no-Mudazukai', status: 301 },
  '/post/Just-Because': { destination: '/posts/Just-Because', status: 301 },
  '/post/Kaifuku-Jutsushi-no-Yarinaoshi': {
    destination: '/posts/Kaifuku-Jutsushi-no-Yarinaoshi',
    status: 301,
  },
  '/post/Karakuri-Sakasu': { destination: '/posts/Karakuri-Sakasu', status: 301 },
  '/post/Kenja-no-Mago': { destination: '/posts/Kenja-no-Mago', status: 301 },
  '/post/Kenpufa': { destination: '/posts/Kenpufa', status: 301 },
  '/post/Kimetsu-no-Yaiba': { destination: '/posts/Kimetsu-no-Yaiba', status: 301 },
  '/post/Kimi-ni-Todoke': { destination: '/posts/Kimi-ni-Todoke', status: 301 },
  '/post/Kimi-no-Suizou-o-Tabetai': { destination: '/posts/Kimi-no-Suizou-o-Tabetai', status: 301 },
  '/post/Kiseijuu': { destination: '/posts/Kiseijuu', status: 301 },
  '/post/Kore-wa-Zonbi-Desuka': { destination: '/posts/Kore-wa-Zonbi-Desuka', status: 301 },
  '/post/Kureimoa': { destination: '/posts/Kureimoa', status: 301 },
  '/post/Kyokai-no-Kanata': { destination: '/posts/Kyokai-no-Kanata', status: 301 },
  '/post/Mao-Gakuin-no-Futekigosha': {
    destination: '/posts/Mao-Gakuin-no-Futekigosha',
    status: 301,
  },
  '/post/Master-of-Ragnarok-and-Blesser-of-Einherjar': {
    destination: '/posts/Master-of-Ragnarok-and-Blesser-of-Einherjar',
    status: 301,
  },
  '/post/MondaiJi-tachi-ga-Isekai-Kara-Kuru-Soudesuyo': {
    destination: '/posts/MondaiJi-tachi-ga-Isekai-Kara-Kuru-Soudesuyo',
    status: 301,
  },
  '/post/Monsuta-Musume-no-Oisha-san': {
    destination: '/posts/Monsuta-Musume-no-Oisha-san',
    status: 301,
  },
  '/post/MushiShi': { destination: '/posts/MushiShi', status: 301 },
  '/post/My-Love-Story': { destination: '/posts/My-Love-Story', status: 301 },
  '/post/Nerawareta-Gakuen': { destination: '/posts/Nerawareta-Gakuen', status: 301 },
  '/post/No-Game-No-Life': { destination: '/posts/No-Game-No-Life', status: 301 },
  '/post/OS': { destination: '/posts/OS', status: 301 },
  '/post/Ore-ga-Ojo-sama-Gakko-ni-Shomin-Sample-Toshite-Rachirareta-Ken': {
    destination: '/posts/Ore-ga-Ojo-sama-Gakko-ni-Shomin-Sample-Toshite-Rachirareta-Ken',
    status: 301,
  },
  '/post/Ore-o-Suki-nano-wa-Omae-dake-kayo': {
    destination: '/posts/Ore-o-Suki-nano-wa-Omae-dake-kayo',
    status: 301,
  },
  '/post/Owari-no-Seraph': { destination: '/posts/Owari-no-Seraph', status: 301 },
  '/post/Oya-san-wa-Shishunki': { destination: '/posts/Oya-san-wa-Shishunki', status: 301 },
  '/post/Rainbow-Days': { destination: '/posts/Rainbow-Days', status: 301 },
  '/post/Rakudai-Kishi-no-Kyabaruryi': {
    destination: '/posts/Rakudai-Kishi-no-Kyabaruryi',
    status: 301,
  },
  '/post/Rokujoma-no-shinryaku-sha': {
    destination: '/posts/Rokujoma-no-shinryaku-sha',
    status: 301,
  },
  '/post/Sakura-Quest': { destination: '/posts/Sakura-Quest', status: 301 },
  '/post/Sakurako-san-no-Ashimoto-ni-wa-Shitai-ga-Umatteiru': {
    destination: '/posts/Sakurako-san-no-Ashimoto-ni-wa-Shitai-ga-Umatteiru',
    status: 301,
  },
  '/post/Sangatsu-no-Lion': { destination: '/posts/Sangatsu-no-Lion', status: 301 },
  '/post/Seikoku-no-Dragonar': { destination: '/posts/Seikoku-no-Dragonar', status: 301 },
  '/post/Shigatsu-wa-kimi-no-uso': { destination: '/posts/Shigatsu-wa-kimi-no-uso', status: 301 },
  '/post/Shingeki-no-Bahamut': { destination: '/posts/Shingeki-no-Bahamut', status: 301 },
  '/post/Shinmai-Maou-no-Testament': {
    destination: '/posts/Shinmai-Maou-no-Testament',
    status: 301,
  },
  '/post/Shiroi-Kyoto': { destination: '/posts/Shiroi-Kyoto', status: 301 },
  '/post/Silver-Spoon': { destination: '/posts/Silver-Spoon', status: 301 },
  '/post/Somali-to-Mori-no-Kamisama': {
    destination: '/posts/Somali-to-Mori-no-Kamisama',
    status: 301,
  },
  '/post/Stories-of-Last-Letter': { destination: '/posts/Stories-of-Last-Letter', status: 301 },
  '/post/Tasogare-Otome-x-Amnesia': { destination: '/posts/Tasogare-Otome-x-Amnesia', status: 301 },
  '/post/Tenshi-no-3P': { destination: '/posts/Tenshi-no-3P', status: 301 },
  '/post/The-Ancient-Magus-Bride': { destination: '/posts/The-Ancient-Magus-Bride', status: 301 },
  '/post/Tower-Of-God': { destination: '/posts/Tower-Of-God', status: 301 },
  '/post/Uchi-no-Musume-no-Tame-naraba-Ore-wa-Moshikashitara-Maou-mo-Taoseru-kamo-Shirenai': {
    destination:
      '/post/posts/Uchi-no-Musume-no-Tame-naraba-Ore-wa-Moshikashitara-Maou-mo-Taoseru-kamo-Shirenai',
    status: 301,
  },
  '/post/Uzaki-chan-wa-Asobitai': { destination: '/posts/Uzaki-chan-wa-Asobitai', status: 301 },
  '/post/What-Do-You-Do-at-the-End-of-the-World-Are-You-Busy-Will-You-Save-Us': {
    destination: '/posts/What-Do-You-Do-at-the-End-of-the-World-Are-You-Busy-Will-You-Save-Us',
    status: 301,
  },
  '/post/When-the-Promised-Flower-Blooms': {
    destination: '/posts/When-the-Promised-Flower-Blooms',
    status: 301,
  },
  '/post/Yahari-ore-no-seishun-rabu-kome-wa-machigatte-iru-14': {
    destination: '/posts/Yahari-ore-no-seishun-rabu-kome-wa-machigatte-iru-14',
    status: 301,
  },
  '/post/Your-Home-is-My-Business': { destination: '/posts/Your-Home-is-My-Business', status: 301 },
  '/post/Yusha-ni-Narenakatta-Ore-wa-Shibushibu-Shushoku-o-Ketsui-Shimashita': {
    destination: '/posts/Yusha-ni-Narenakatta-Ore-wa-Shibushibu-Shushoku-o-Ketsui-Shimashita',
    status: 301,
  },
  '/post/Zankyo-no-Teroru': { destination: '/posts/Zankyo-no-Teroru', status: 301 },
  '/post/Zero-kara-hajimeru-mahou-no-sho': {
    destination: '/posts/Zero-kara-hajimeru-mahou-no-sho',
    status: 301,
  },
  '/post/Zero-no-Tsukaima': { destination: '/posts/Zero-no-Tsukaima', status: 301 },
  '/post/Zettai-Karen-Chirudoren-THE-UNLIMITED': {
    destination: '/posts/Zettai-Karen-Chirudoren-THE-UNLIMITED',
    status: 301,
  },
  '/post/annoucement-system-design': {
    destination: '/posts/annoucement-system-design',
    status: 301,
  },
  '/post/as-the-moon-so-beautiful': { destination: '/posts/as-the-moon-so-beautiful', status: 301 },
  '/post/awesome-programming-books': {
    destination: '/posts/awesome-programming-books',
    status: 301,
  },
  '/post/bilibili-message-cleaner': { destination: '/posts/bilibili-message-cleaner', status: 301 },
  '/post/blood-lad': { destination: '/posts/blood-lad', status: 301 },
  '/post/build-development-environment-with-docker': {
    destination: '/posts/build-development-environment-with-docker',
    status: 301,
  },
  '/post/computer-organization': { destination: '/posts/computer-organization', status: 301 },
  '/post/databaes-system': { destination: '/posts/databaes-system', status: 301 },
  '/post/develop-vue-project-with-laradock': {
    destination: '/posts/develop-vue-project-with-laradock',
    status: 301,
  },
  '/post/frontend-source-debug': { destination: '/posts/frontend-source-debug', status: 301 },
  '/post/galgame-translator': { destination: '/posts/galgame-translator', status: 301 },
  '/post/gamers': { destination: '/posts/gamers', status: 301 },
  '/post/grisaia': { destination: '/posts/grisaia', status: 301 },
  '/post/gto': { destination: '/posts/gto', status: 301 },
  '/post/high-school-dxd': { destination: '/posts/high-school-dxd', status: 301 },
  '/post/js-sandbox': { destination: '/posts/js-sandbox', status: 301 },
  '/post/laravel-user-login-log': { destination: '/posts/laravel-user-login-log', status: 301 },
  '/post/laravel-wallet': { destination: '/posts/laravel-wallet', status: 301 },
  '/post/log-horizon': { destination: '/posts/log-horizon', status: 301 },
  '/post/manjaro-xfce-hacking': { destination: '/posts/manjaro-xfce-hacking', status: 301 },
  '/post/multi-device-login-with-laravel-passport-and-clear-reset-token': {
    destination: '/posts/multi-device-login-with-laravel-passport-and-clear-reset-token',
    status: 301,
  },
  '/post/nana': { destination: '/posts/nana', status: 301 },
  '/post/new-game': { destination: '/posts/new-game', status: 301 },
  '/post/oop-java': { destination: '/posts/oop-java', status: 301 },
  '/post/smile-salesman': { destination: '/posts/smile-salesman', status: 301 },
  '/post/tamako-maketto': { destination: '/posts/tamako-maketto', status: 301 },
  '/post/the-shape-of-voice': { destination: '/posts/the-shape-of-voice', status: 301 },
  '/post/to-Love-Ru': { destination: '/posts/to-Love-Ru', status: 301 },
  '/post/ubuntu-on-virtualbox': { destination: '/posts/ubuntu-on-virtualbox', status: 301 },
  '/post/upload-file-by-chunk-and-ingore-upload': {
    destination: '/posts/upload-file-by-chunk-and-ingore-upload',
    status: 301,
  },
  '/post/v2ray': { destination: '/posts/v2ray', status: 301 },
};

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  site: 'https://www.tore.moe',
  vite: {
    plugins: [tailwindcss(), pagefindDevPlugin()],
  },

  integrations: [
    react(),
    mdx(),
    reactI18next({
      defaultLocale: 'zh-CN',
      locales: ['en-US', 'zh-CN'],
    }),
    pagefind({
      indexConfig: {
        rootSelector: '.prose',
      },
    }),
    sitemap(),
    AstroPWA(),
    compress({
      HTML: false,
    }),
  ],

  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid', 'math'],
    },
    remarkPlugins: [remarkMath, remarkDirective, remarkMedia],
    rehypePlugins: [
      rehypeMathjax,
      [
        rehypeMermaid,
        {
          strategy: 'img-svg',
        },
      ],
    ],
  },

  // 禁用图片优化，直接使用原始图片
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },

  // 配置重定向
  redirects: {
    ...FIXED_REDIRECTS,
  },
});
