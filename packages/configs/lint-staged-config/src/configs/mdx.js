const { concatFilesForPrettier } = require("../common");

/**
 * @type {Record<string, (filenames: string[]) => string | string[] | Promise<string | string[]>>}
 */
module.exports = {
  "**/*.mdx": (filenames) => {
    return [`prettier --write ${concatFilesForPrettier(filenames)}`];
  },
};
