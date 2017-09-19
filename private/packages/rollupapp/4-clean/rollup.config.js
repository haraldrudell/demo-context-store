/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import babel from 'rollup-plugin-babel'

import util from 'util'

const config = {
  input: '4-clean/cleanbin', // input default extension is .js
  output: {file: '4-clean/clean-cjs.js', format: 'cjs'}, // output must have extension
  external: ['fs-extra', 'path'], // imports and Node.js standard library needs to be excluded
}
export default config
console.log(`node ${config.output.file}`)

const babelOptions = {
  babelrc: false,
  presets: [['es2015', {modules: false}]],
  plugins: [
    'external-helpers',
  ]
}

const rollupBabelOptions = Object.assign({
  externalHelpers: true,
}, babelOptions)

Object.assign(config, {
  plugins: [
    babel(rollupBabelOptions),
  ]
})

console.log('Rollup configuration output for:', __filename)
console.log('Object:', util.inspect(config, {colors: true, depth: null}))
console.log('Babel options:', util.inspect(babelOptions, {colors: true, depth: null}))
