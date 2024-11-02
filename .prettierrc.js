const { prettier } = require("@fe-boilerplate/eslint-config/configs");

/**
 * @type {import('prettier').Config}
 */
module.exports = {
  ...prettier,
  overrides: [
    // whatever you need
  ],
};
