const { concatFilesForPrettier } = require('../common')

/**
 * @type {Record<string, (filenames: string[]) => string | string[] | Promise<string | string[]>>}
 */
module.exports = {
  '**/*.json': filenames => {
    return [`prettier --write ${concatFilesForPrettier(filenames)}`]
  },
  'package.json,packages/configs/*/package.json,{apps,packages}/*/package.json': () => [`sort-package-json`],
}
