// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import compress from '@playform/compress';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';
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
});
