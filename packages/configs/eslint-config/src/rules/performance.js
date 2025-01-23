const { filePatterns } = require('../configs/file-patterns')

module.exports = {
  overrides: [
    {
      plugins: ['unicorn'],
      files: filePatterns.typescriptAndJsCodeWithoutJsx,
      excludedFiles: filePatterns.nonCodeFile,
      rules: {
        'unicorn/prefer-set-has': 'error',
      },
    },
  ],
}
