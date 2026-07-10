// @ts-check

import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu(
    {
      // Nuxt is an application, not a reusable library.
      type: 'app',

      ignores: [
        '**/fixtures/**',
        'README.md',
      ],

      gitignore: true,

      stylistic: {
        indent: 2,
        quotes: 'single',
        braceStyle: 'stroustrup',
      },

      typescript: true,
      vue: true,

      jsonc: false,
      yaml: false,
    },

    {
      rules: {
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
