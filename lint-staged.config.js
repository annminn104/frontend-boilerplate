const {
  concatFilesForPrettier,
} = require('@fe-boilerplate/lint-staged-config');
const packageJson = require('@fe-boilerplate/lint-staged-config/package');
const json = require('@fe-boilerplate/lint-staged-config/json');
const yaml = require('@fe-boilerplate/lint-staged-config/yaml');
const md = require('@fe-boilerplate/lint-staged-config/md');
const secrets = require('@fe-boilerplate/lint-staged-config/secrets');
const style = require('@fe-boilerplate/lint-staged-config/style');

const rules = {
  '**/*.{js,jsx,cjs,mjs,ts,tsx,mts,cts}': (filenames) => {
    return [`prettier --write ${concatFilesForPrettier(filenames)}`];
  },
  ...packageJson,
  ...json,
  ...yaml,
  ...md,
  ...style,
  ...secrets,
};

module.exports = rules;
