module.exports = {
  overrides: [
    {
      files: ['*.jsx', '*.tsx'],
      plugins: ['perfectionist'],
      rules: {
        'perfectionist/sort-jsx-props': 'error',
      },
    },
  ],
};
