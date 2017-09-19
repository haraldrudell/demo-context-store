/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import babel from 'rollup-plugin-babel'
import util from 'util'

const inputOutputExternal = {
  input: '0-helloworld/helloworld.js',
  output: [{file: `0-helloworld/helloworld-cjs.js`, format: 'cjs'}],
  external: undefined /*[].concat(nodejsExternals)*/,
}
console.log(`node ${inputOutputExternal.output[0].file}`)
const rollupPluginBabelOptions = {
  babelrc: false,
}

const babelOptions = Object.assign({},
  rollupPluginBabelOptions,
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
