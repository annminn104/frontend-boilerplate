const reactPatterns = {
  files: ['*.{jsx,tsx}'],
}

module.exports = {
  overrides: [
    {
      extends: [
        // @see https://tanstack.com/query/v4/docs/react/eslint/eslint-plugin-query
        'plugin:@tanstack/eslint-plugin-query/recommended',
      ],
      files: [...reactPatterns.files],
      // rules: { },
    },
  ],
}
