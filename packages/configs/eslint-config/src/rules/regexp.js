const { filePatterns } = require('../configs/file-patterns')

module.exports = {
  // @see https://github.com/ota-meshi/eslint-plugin-regexp
  extends: ['plugin:regexp/recommended'],
  overrides: [
    {
      extends: ['plugin:regexp/recommended'],
      // To ensure best performance enable only on e2e test files
      files: filePatterns.typescriptCodeWithJsx,
      rules: {
        'regexp/prefer-result-array-groups': 'off',
      },
    },
  ],
}
