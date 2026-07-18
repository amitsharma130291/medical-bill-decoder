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
  security: {
    // Disable Astro 5's built-in CSRF origin check so that server-to-server
    // webhooks (Gumroad, LemonSqueezy, Paddle) can POST to /api/webhooks/*
    // without a matching Origin header. Browser fetch() calls from the same
    // site still include the correct Origin so this does not weaken client-side
    // security in practice.
    checkOrigin: false,
  },
});
