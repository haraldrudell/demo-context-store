/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import EsmWebpackPlugin from '@purtuga/esm-webpack-plugin'

import path from 'path'

import pjson from './package.json'

const defaults = {
  cjsExt: '.js',
  esmExt: '.js',
}

let {main, module} = Object(pjson)

if (!main || typeof main !== 'string') throw new Error('package.json main not non-empty string')
if (!path.extname(main)) main += defaults.cjsExt

if (!module || typeof module !== 'string') throw new Error('package.json module not non-empty string')
if (!path.extname(module)) module += defaults.esmExt

/*const paths = {
  lib: path.resolve('lib'),
  esmJs: 'cjs.js',
  cjsJs: 'cjs.js',
}
*/
export default [{ // ESM format
  output: {
    path: path.resolve(path.dirname(module)),
    filename: path.basename(module),
  },
  plugins: [
    new EsmWebpackPlugin(),
  ],
},{ // CJS format
  output: {
    path: path.resolve(path.dirname(main)),
    filename: path.basename(main),
    libraryTarget: 'commonjs',
  },
}].map(o => ({...sharedOptions(), ...o}))

function sharedOptions() {
  return {
    // input: './src/index.js',
    devtool: 'spource-map',
    mode: 'production', //'development',
  }
}