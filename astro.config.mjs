// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],

    // Pre-bundle the React runtimes up front. Without this, Vite discovers
    // `react/jsx-dev-runtime` lazily and re-optimizes mid-session after a file
    // or dependency change, which leaves the already-loaded page holding a stale
    // module and every React island dies with
    // "TypeError: _jsxDEV is not a function".
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime']
    }
  },

  integrations: [react()],
  adapter: vercel()
});