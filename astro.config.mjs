import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dusunbedalo.example.id',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/design-check'),
    }),
  ],
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
