// @ts-check
const { getPrettierConfig } = require('./src/configs')

/**
 * @type {import('prettier').Config}
 */
module.exports = {
  ...getPrettierConfig(),
  overrides: [
    // whatever you need
  ],
}
