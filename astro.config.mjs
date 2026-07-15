import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://eobdecoder.com',
  output: 'server',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind(),
    sitemap(),
    mdx(),
  ],
});
