import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import './lib/env'

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
  ],

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
})
