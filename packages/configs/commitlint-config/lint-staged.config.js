const { getEslintFixCmd } = require('@fe-boilerplate/lint-staged-config')

const json = require('@fe-boilerplate/lint-staged-config/json')
const yaml = require('@fe-boilerplate/lint-staged-config/yaml')
const secrets = require('@fe-boilerplate/lint-staged-config/secrets')
const md = require('@fe-boilerplate/lint-staged-config/md')
const html = require('@fe-boilerplate/lint-staged-config/html')

/**
 * @typedef {Record<string, (filenames: string[]) => string | string[] | Promise<string | string[]>>} LintRule
 */
const rules = {
  '**/*.{js,jsx,ts,tsx}': (/** @type {any} */ filenames) => {
    return getEslintFixCmd({
      cwd: __dirname,
      fix: true,
      cache: true,
      // when auto-fixing staged-files a good tip is to disable react-hooks/exhaustive-deps, cause
      // a change here can potentially break things without proper visibility.
      rules: ['react-hooks/exhaustive-deps: off'],
      maxWarnings: 25,
      files: filenames,
    })
  },
  ...json,
  ...secrets,
  ...md,
  ...yaml,
  ...html,
}

module.exports = rules
