const getPrettierConfig = () => {
  return {
    tabWidth: 2,
    arrowParens: 'avoid',
    singleQuote: true,
    semi: false,
    trailingComma: 'es5',
    useTabs: false,
    bracketSpacing: true,
    bracketSameLine: false,
    printWidth: 120,
    endOfLine: 'crlf',
    overrides: [
      {
        files: ['*.html'],
        options: {
          // disable to prevent conflicts with html-validate
          trailingComma: 'none',
          // https://prettier.io/blog/2018/11/07/1.15.0.html#whitespace-sensitive-formatting
          htmlWhitespaceSensitivity: 'css',
          singleAttributePerLine: true,
        },
      },
    ],
  }
}

module.exports = {
  getPrettierConfig,
}
