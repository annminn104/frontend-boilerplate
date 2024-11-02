const { getPrettierConfig } = require("../configs");

const { ...prettierConfig } = getPrettierConfig();

module.exports = {
  extends: ["prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["error", prettierConfig],
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
  },
};
