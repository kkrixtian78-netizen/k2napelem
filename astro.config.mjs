// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://k2napelem.hu',
  trailingSlash: 'never',
  // Hybrid: marketing pages stay prerendered; /arajanlat + APIs run on Node.
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  vite: {
    // Expose FORM_* and PUBLIC_* to the Astro build (Vercel env vars).
    envPrefix: ['PUBLIC_', 'FORM_'],
    plugins: [tailwindcss()],
  },
  integrations: [sitemap(), react()],
});
