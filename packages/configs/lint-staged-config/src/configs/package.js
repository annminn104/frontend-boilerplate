/**
 * @type {Record<string, (filenames: string[]) => string | string[] | Promise<string | string[]>>}
 */
module.exports = {
  "package.json,{packages,apps}/*/package.json": [
    "syncpack list-mismatches",
    "syncpack lint-semver-ranges",
  ],
};
