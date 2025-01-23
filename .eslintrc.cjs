const { getIgnorePatterns } = require('@fe-boilerplate/eslint-config/configs')

module.exports = {
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.base.json',
  },
  ignorePatterns: [...getIgnorePatterns()],
  extends: ['@fe-boilerplate/eslint-config/typescript', '@fe-boilerplate/eslint-config/mdx', '@fe-boilerplate/eslint-config/prettier'],
}
