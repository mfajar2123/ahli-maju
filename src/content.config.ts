import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['Keselamatan', 'Lingkungan', 'Industri']),
    draft: z.boolean().default(false),
    example: z.boolean().default(true),
    image: z.enum(['quarry', 'operations']).default('quarry'),
    seoTitle: z.string().optional(),
  }),
});
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Perencanaan', 'Operasional', 'Lingkungan']),
    draft: z.boolean().default(false),
    example: z.boolean().default(true),
    image: z.enum(['quarry', 'operations']),
    scope: z.array(z.string()),
    outcome: z.string(),
  }),
});
export const collections = { news, projects };
