const rtlPatterns = {
  files: ['**/?(*.)+(test).{js,jsx,ts,tsx}'],
}

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  overrides: [
    {
      extends: ['plugin:testing-library/react'],
      // For performance enable react-testing-library only on test files
      files: rtlPatterns.files,
    },
    {
      files: ['**/test-utils.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'import/export': 'off',
      },
    },
  ],
}
