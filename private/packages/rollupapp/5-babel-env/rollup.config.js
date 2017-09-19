/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

import util from 'util'

const config = {
  input: '5-babel-env/cleanbin', // input default extension is .js
  output: {file: '5-babel-env/clean-cjs.js', format: 'cjs'}, // output must have extension
  external: ['fs-extra', 'path'], // imports and Node.js standard library needs to be excluded
}
export default config
console.log(`node ${config.output.file}`)

// determine running Node.js major version
const matchResult = String(process.version).match(/^v([0-9]+)/)
const num = Number(matchResult && matchResult[1])
const nodeMajorVersion = num > 0 ? num : 0 // 8, default 0
console.log(`Node.js major version: ${nodeMajorVersion} >= 8: ${nodeMajorVersion >= 8}`)
const n8plus = nodeMajorVersion >= 8

const babelOptions = {
  babelrc: false,
  presets: [].concat(!n8plus ? [['env', {modules: false}]] : []),
  plugins: [].concat(n8plus ? [ // transforms not in Node.js version 8.4
    'transform-class-properties', // class f { a = 1… stage-2 170919
    'transform-object-rest-spread', // {...o} stage-3 170919
    'transform-export-extensions', // export * as ns… export a from… stage-1 170919
    'transform-async-generator-functions', // for await… stage-3 170919
    'transform-es2015-block-scoping',
    ['transform-es2015-for-of', {loose: true}],
    'transform-inline-consecutive-adds',
    'minify-dead-code-elimination',
  ] : []).concat([
    'external-helpers', // babel externalized helpers
    // rollup-regenerator-runtime is inserted into the bundle
    // rollup therefore needs rollup-plugin-node-resolve
    // it is an ECMAScript 2015 module, so commonjs is not required
    ['transform-runtime', {helpers: false, polyfill: false,
      moduleName: 'rollup-regenerator-runtime'
    }]
  ]),
}

const rollupBabelOptions = Object.assign({
}, babelOptions)

Object.assign(config, {
  plugins: [
    babel(rollupBabelOptions),
    resolve(),
  ]
})

console.log('Rollup configuration output for:', __filename)
console.log('Object:', util.inspect(config, {colors: true, depth: null}))
console.log('Babel options:', util.inspect(babelOptions, {colors: true, depth: null}))
