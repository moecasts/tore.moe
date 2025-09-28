import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { buildStaticPaths } from 'astro-react-i18next/utils';
import { getSortedPosts } from '@/lib/posts';

export async function GET(context: APIContext) {
  const { locale } = context.params as { locale: string };

  // 确保locale存在，如果不存在则使用默认语言
  const currentLocale = locale || 'zh-CN';

  try {
    const sortedPosts = await getSortedPosts();

    // 过滤出当前语言的文章
    const localePosts = sortedPosts.filter((post) => {
      // 如果文章有语言标识，使用它；否则假设为默认语言
      const postLocale = post.data.locale || 'zh-CN';
      return postLocale === currentLocale;
    });

    return rss({
      title: currentLocale === 'zh-CN' ? '荡れ - 最新文章' : 'Tore - Latest Posts',
      description:
        currentLocale === 'zh-CN'
          ? '蕩れ（とれ）とは、萌えの一段階上の言葉である。'
          : 'Tore is a word that represents a level above moe.',
      site: context.site || 'https://www.tore.moe',
      items: localePosts.map((post) => ({
        title: post.data.title,
        pubDate: new Date(post.data.date as string),
        link: `/${currentLocale}/posts/${post.data.slug || post.slug}`,
        customData: `<language>${currentLocale}</language>`,
      })),
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return new Response('RSS generation failed', { status: 500 });
  }
}

export async function getStaticPaths() {
  return buildStaticPaths();
}
