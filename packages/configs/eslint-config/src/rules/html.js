const htmlPatterns = {
  files: ['**/*.html'],
};

module.exports = {
  plugins: ['@html-eslint'],
  overrides: [
    {
      files: htmlPatterns.files,
      parser: '@html-eslint/parser',
      extends: ['plugin:@html-eslint/recommended'],
    },
  ],
};
