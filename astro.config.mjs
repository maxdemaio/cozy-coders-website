import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://cozy.foo', // absolute og:image / og:url need it; swap if the domain differs
  integrations: [react(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
