// @ts-check
/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.test.{js,jsx,ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  rootDir: './',
  // false by default, overrides in cli, ie: yarn test:unit --collect-coverage=true
  collectCoverage: false,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['<rootDir>/**/*.{ts,tsx,js,jsx}', '!**/*.test.{js,ts}', '!**/__mock__/*'],
  coveragePathIgnorePatterns: ['<rootDir>/.next/*', '<rootDir>/coverage/*'],
  passWithNoTests: true,
}

module.exports = config
