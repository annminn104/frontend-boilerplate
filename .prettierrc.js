const { getPrettierConfig } = require('@fe-boilerplate/eslint-config/configs')

const { overrides = [], ...prettierConfig } = getPrettierConfig()

/**
 * @type {import('prettier').Config}
 */
module.exports = {
  ...prettierConfig,
  overrides: [
    ...overrides,
    ...[
      {
        files: '*.md',
        options: {
          singleQuote: false,
          quoteProps: 'preserve',
        },
      },
    ],
  ],
}
