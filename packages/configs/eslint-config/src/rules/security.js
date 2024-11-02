const regexpPatterns = {
  files: ["*.{js,jsx,jsx,tsx}"],
};

module.exports = {
  // @see https://github.com/eslint-community/eslint-plugin-security
  extends: ["plugin:security/recommended-legacy"],
  overrides: [
    {
      files: regexpPatterns.files,
      extends: ["plugin:security/recommended-legacy"],
      // rules: {},
    },
  ],
};
