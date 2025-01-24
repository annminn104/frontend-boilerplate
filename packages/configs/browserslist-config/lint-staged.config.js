// @ts-check

const { getEslintFixCmd } = require('@fe-boilerplate/lint-staged-config')
const { ESLint } = require('eslint')

const cli = new ESLint({})
const json = require('@fe-boilerplate/lint-staged-config/json')
const yaml = require('@fe-boilerplate/lint-staged-config/yaml')
const secrets = require('@fe-boilerplate/lint-staged-config/secrets')
const md = require('@fe-boilerplate/lint-staged-config/md')
const html = require('@fe-boilerplate/lint-staged-config/html')

/**
 * @typedef {Record<string, (filenames: string[]) => string | string[] | Promise<string | string[]>>} LintRule
 */
const rules = {
  ...json,
  ...secrets,
  ...md,
  ...yaml,
  ...html,
  '**/*.{js,jsx,ts,tsx}': filenames => {
    return [
      `eslint --rule 'react-hooks/exhaustive-deps: off' --max-warnings=25 --fix ${filenames
        .filter(file => !cli.isPathIgnored(file))
        .map(f => `"${f}"`)
        .join(' ')}`,
    ]
  },
}

module.exports = rules
