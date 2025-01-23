const { concatFilesForPrettier } = require('../common')

/**
 * @type {Record<string, (filenames: string[]) => string | string[] | Promise<string | string[]>>}
 */
module.exports = {
  '**/*.{css,scss}': filenames => {
    return [`prettier --write ${concatFilesForPrettier(filenames)}`]
  },
}
