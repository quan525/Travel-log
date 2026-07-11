// @ts-check

import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu(
    {
      // Nuxt is an application, not a reusable library.
      type: 'app',

      gitignore: true,

      stylistic: {
        indent: 2,
        quotes: 'single',
        braceStyle: 'stroustrup',
      },

      vue: true,
      typescript: true,
      formatters: true,
      jsonc: false,
      yaml: false,

      ignores: [".pnpm-store/**", "**/migrations/*"]
    },

    {
      rules: {
        'ts/no-redeclare': 'off',
        'unicorn/filename-case': [
          'error',
          {
            cases: {
              kebabCase: true,
              snakeCase: true,
            },
          },
        ],
      },
    },
  ),
)
