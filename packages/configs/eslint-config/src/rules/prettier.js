const { getPrettierConfig } = require('../configs')

const { ...prettierConfig } = getPrettierConfig()

module.exports = {
  extends: ['prettier'],
  plugins: ['prettier'],
  rules: {
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'prettier/prettier': ['error', { prettierConfig: { getPreference: () => prettierConfig } }],
  },
}
