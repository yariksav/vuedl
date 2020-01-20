module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    'jest/globals': true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/strongly-recommended',
    'standard'
  ],
  plugins: [
    'vue',
    'jest'
  ],
  rules: {
    'no-debugger': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'vue/max-attributes-per-line': 'off',
    'vue/html-indent': 'off',
    'vue/require-default-prop': 'off',
    'no-useless-escape': 'off',
    'vue/component-name-in-template-casing': 'off',
    'vue/multiline-html-element-content-newline': 'off'
  },
  globals: {}
}
