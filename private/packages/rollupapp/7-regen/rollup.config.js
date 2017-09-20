/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

/*
how to use regenerators
*/
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

import util from 'util'
import path from 'path'
import {Hash} from 'crypto'

const input = '7-regen/regen'

const config = []
export default config

/*
as of 170919,  env invludes ECMAScript 2017 that has async functions and generator functions
use those two constructs and see if it runs:
https://babeljs.io/docs/plugins/transform-async-to-generator/

First run:
ReferenceError: regeneratorRuntime is not defined
Warning: Babel helper is used more than once

The transpiled code references:
regeneratorRuntime.mark
regeneratorRuntime.wrap

The Babel plugin regenerator transform notes that either the Babel polyfill or the regenerator runtime is required.
https://babeljs.io/docs/plugins/transform-regenerator/

Add: transform-runtime

Error:
[!] (babel plugin) Error: Runtime helpers are not enabled. Either exclude the transform-runtime Babel plugin or pass the `runtimeHelpers: true` option. See https://github.com/rollup/rollup-plugin-babel#configuring-babel for more information

Add: runtimeHelpers: true

Error:
[!] Error: A module cannot import itself
../../node_modules/babel-runtime/helpers/typeof.js (3:0)
- probably transpiling transpiled code.
*/
//add: include: '**/*.js'
/*

Warning:
(!) Missing exports
https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
commonjs-proxy:/opt/foxyboy/sw/private/node_modules/core-js/library/modules/es6.object.to-string.js
default is not exported by ../../node_modules/core-js/library/modules/es6.object.to-string.js
- this is an empty file

code runs!

availer still has:
ReferenceError: babelHelpers is not defined

What controls whether babelHelpers or _classCallCheck?
It seems to be the external-helpers plugin

*/
config.push(getConfig({input, output: `${input}-cjs`, plugins: () => [getBabel({
    babelrc: false,
    runtimeHelpers: true,
    include: '**/*.js',
    presets: [['env', {modules: false}]],
    plugins: [
      'transform-runtime',
//      'external-helpers',
//      ['transform-runtime', {polyfill: false}],
    ],
  }),
  resolve(),
  commonjs(),
  sha256Plugin(),
]}))

function getConfig({input, output, plugins}) {
  output += '.js'
  console.log(`node ${output}`)
  const config = {
    input,
    output: {file: output, format: 'cjs'},
    plugins: plugins(),
  }

  console.log(`Rollup configuration: ${util.inspect(config, {colors: true, depth: null})}`)

  return config
}

function getBabel(babelOptions) {
  console.log(`Babel options: ${util.inspect(babelOptions, {colors: true, depth: null})}`)
  return babel(babelOptions)
}

function sha256Plugin() {
  return {
    name: 'sha256Plugin',
    onwrite(bundle, data) {
      const {code} = data
      console.log(`${path.basename(bundle.file)} bytes: ${code.length} sha256: ${new Hash('sha256').update(code).digest('hex')}`)
    },
  }
}
