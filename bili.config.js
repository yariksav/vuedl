module.exports = {
  babel: {
    minimal: true
  },
  output: {
    moduleName: 'vuedl',
  },
  plugins: {
    vue: true
  },
  externals: ['vue'],
  globals: {
    vue: 'Vue'
  }
}