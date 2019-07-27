import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import { uglify } from 'rollup-plugin-uglify';
// import scss from 'rollup-plugin-scss';
// import copy from 'rollup-plugin-copy';
import minimist from 'minimist';
import commonjs from 'rollup-plugin-commonjs';

const argv = minimist(process.argv.slice(2));

const config = {
  input: 'src/index.js',
  output: {
    name: 'Vuedl',
    exports: 'named',
    globals: {
      vue: 'Vue',
      'vue-asyncable': 'VueAsyncable'
    }
  },
  external: [ 'vue', 'vue-asyncable' ],
  plugins: [
    commonjs(),
    // scss({
    //   output: 'dist/vue-flag.css',
    //   outputStyle: 'compressed'
    // }),
    // async(),
    vue({
      css: true,
      compileTemplate: true,
    }),
    buble({
      objectAssign: 'Object.assign',
      transforms: { asyncAwait: false }
      // as
    }),
  ]
};

if (argv.format === 'iife') {
  config.plugins.push(uglify());
}

export default config;
