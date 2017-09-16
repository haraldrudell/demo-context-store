/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import pkg from './package.json'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import util from 'util'

// rollup input/output/external: https://rollupjs.org/#big-list-of-options
if (!pkg.main) throw new Error('Package.json main field empty')
const inputOutputExternal = {
  input: 'src/Process.js',
  output: [{file: `${pkg.main}.js`, format: 'cjs'}],
  external: []/*.concat(nodejsExternals)*/,
}
console.log(`node ${inputOutputExternal.output[0].file}`) // display how to execute result

// https://rollupjs.org/#big-list-of-options
const rollupOptions = {
}

// https://www.npmjs.com/package/rollup-plugin-babel
const rollupPluginBabelOptions = {
  include: '**/*.js', // ie. exclude .json
}

// https://babeljs.io/docs/core-packages/#options
const babelOptions = Object.assign({}, rollupPluginBabelOptions, {
  babelrc: false,
  plugins: [
    'transform-object-rest-spread',
    'transform-class-properties',
  ]})

// https://www.npmjs.com/package/rollup-plugin-node-resolve
const noderesolveOptions = {
  preferBuiltins: true
}

const object = [Object.assign({},
  inputOutputExternal,
  rollupOptions,
  {plugins: [
    babel(babelOptions),
    json(),
    resolve(noderesolveOptions),
    commonjs(),
  ]},
)]

console.log('Rollup configuration output for:', __filename)
console.log('Rollup options:', util.inspect(object, {colors: true, depth: null}))
console.log('Babel options:', util.inspect(babelOptions, {colors: true, depth: null}))
console.log('Node Resolve  options:', util.inspect(noderesolveOptions, {colors: true, depth: null}))
export default object
