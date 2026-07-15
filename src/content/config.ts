import { defineCollection, z } from 'astro:content';

const glossaryCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
    publishedAt: z.date().optional(),
  }),
});

const guidesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
    publishedAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
});

const statesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
    publishedAt: z.date().optional(),
  }),
});

export const collections = {
  glossary: glossaryCollection,
  guides: guidesCollection,
  states: statesCollection,
};
