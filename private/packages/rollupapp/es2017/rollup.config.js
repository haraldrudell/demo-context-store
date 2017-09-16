/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import babel from 'rollup-plugin-babel'
import util from 'util'

const nodejsExternals = ['dgram', 'events', 'net', 'os', 'util']

const inputOutputExternal = {
  input: 'es2017/es2017.js',
  output: [{file: `es2017/es2017-cjs.js`, format: 'cjs'}],
  external: [].concat(nodejsExternals),
}
console.log(`node ${inputOutputExternal.output[0].file}`)
const rollupPluginBabelOptions = {
  babelrc: false,
}

const babelOptions = Object.assign({},
  rollupPluginBabelOptions,
  {plugins: [
    'babel-plugin-transform-object-rest-spread',
  ]},
)

const object = [Object.assign({},
  inputOutputExternal,
  {plugins: [
    babel(babelOptions),
  ]},
)]

console.log('Rollup configuration output for:', __filename)
console.log('Object:', util.inspect(object, {colors: true, depth: null}))
console.log('Babel options:', util.inspect(babelOptions, {colors: true, depth: null}))
export default object
