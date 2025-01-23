/**
 * @type {Record<string, (filenames: string[]) => string | string[] | Promise<string | string[]>>}
 */
module.exports = {
  '*.ts|*.tsx': ['jest --bail --findRelatedTests'],
};
