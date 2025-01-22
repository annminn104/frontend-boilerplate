const { getIgnorePatterns } = require('./ignore-patterns')
const { getPrettierConfig } = require('./prettier')
const { filePatterns } = require('./file-patterns')

module.exports = {
  getIgnorePatterns,
  getPrettierConfig,
  filePatterns,
}
