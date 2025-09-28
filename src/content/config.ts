import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    date: z.string().or(z.date()).optional(),
    lastModified: z.string().or(z.date()).optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    locale: z.string().optional(),
  }),
});

const portfolios = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    date: z.string().or(z.date()).optional(),
    lastModified: z.string().or(z.date()).optional(),
    tags: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    demo: z.string().optional(), // Demo URL
    github: z.string().optional(), // GitHub repository URL
    tech: z.array(z.string()).optional(), // Technologies used
    featured: z.boolean().optional(), // Featured project
    pin: z.boolean().optional(), // Pinned project (higher priority in sorting)
    locale: z.string().optional(),
  }),
});

export const collections = {
  posts,
  portfolios,
};
