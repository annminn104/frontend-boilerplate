const getPrettierConfig = () => {
  return {
    bracketSameLine: false,
    bracketSpacing: true,
    endOfLine: 'crlf',
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    useTabs: false,
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
  };
};

module.exports = {
  getPrettierConfig,
};
