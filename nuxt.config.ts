import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import env from './lib/env';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: '.',
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    'nuxt-csurf',
  ],

  csurf: {
    cookie: {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
    },
    encryptSecret: env.CSURF_ENCRYPT_SECRET ?? env.BETTER_AUTH_SECRET,
    methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },

  routeRules: {
    '/api/auth/**': {
      csurf: false,
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    dataValue: 'theme',
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
    ],
  },
});
