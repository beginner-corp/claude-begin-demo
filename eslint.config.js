const arc = require('@architect/eslint-config')
const { globals } = require('@architect/eslint-config')
const { browser } = globals

module.exports = [
  ...arc,
  {
    files: [
      'app/elements/**/*.mjs',
      'app/browser/**/*.mjs',
      'public/**/*.mjs',
    ],
    languageOptions: {
      sourceType: 'module',
      globals: browser,
    },
    rules: {
      '@stylistic/js/semi': 'off',
      'fp/no-class': 'off',
      'no-cond-assign': 'off',
    },
  },
  {
    files: [ 'app/**/*.mjs' ],
    rules: {
      'arc/match-regex': 'off',
    },
  },
  {
    ignores: [
      'scratch',
      'public/browser/index.mjs',
    ],
  },
]
