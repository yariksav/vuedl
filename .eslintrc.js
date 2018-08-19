module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/strongly-recommended',
    'standard'
  ],
  plugins: ['vue'],
  rules: {
    ident: false,
    'no-debugger': 'off',
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-indent': 'off',
    'vue/require-default-prop': 'off',
    'no-useless-escape': 'off'
  },
  globals: {}
}
