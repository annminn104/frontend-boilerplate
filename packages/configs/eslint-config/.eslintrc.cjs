const { getIgnorePatterns } = require('./src/configs/ignore-patterns')

module.exports = {
  extends: [
    './src/rules/typescript',
    './src/rules/simple-import-sort',
    './src/rules/import-x',
    './src/rules/sonar',
    './src/rules/regexp',
    './src/rules/perfectionist',
    './src/rules/performance',
    './src/rules/prettier',
    './src/rules/mdx',
  ],
  ignorePatterns: [...getIgnorePatterns()],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    projectService: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
  rules: {
    '@typescript-eslint/no-require-imports': 'off',
  },
}
