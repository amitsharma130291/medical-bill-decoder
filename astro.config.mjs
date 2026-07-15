import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: process.env.SITE_URL || 'https://medical-bill-decoder.vercel.app',
  output: 'server',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind(),
    sitemap(),
    mdx(),
  ],
});
