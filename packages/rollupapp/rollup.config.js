/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
/*
rollup configuration file
default export is object
format is ECMAScript 2015
https://rollupjs.org/#big-list-of-options
must use a configuration file to use plugins
rollup does not support transform-object-rest-spread
object-rest-spread is not supported, so use Object.assign
*/

/*
Install devDependencies required by this file:
npm i --save-dev \
babel-plugin-external-helpers \
babel-plugin-minify-dead-code-elimination \
babel-plugin-syntax-trailing-function-commas \
babel-plugin-transform-async-generator-functions \
babel-plugin-transform-class-properties \
babel-plugin-transform-export-extensions \
babel-plugin-transform-es2015-block-scoping \
babel-plugin-transform-es2015-for-of \
babel-plugin-transform-inline-consecutive-adds \
babel-plugin-transform-object-rest-spread \
babel-plugin-transform-runtime \
babel-preset-env \
rollup-plugin-babel \
rollup-plugin-commonjs \
rollup-plugin-node-resolve
*/

// required code and data

// data about the project being built
import pkg from './package.json'
// babel transpilation for rollup
import babel from 'rollup-plugin-babel'
// ability to process imported ECMAScript 2015-style modules
import resolve from 'rollup-plugin-node-resolve'
// ability to process imported CommonJS-style modules
import commonjs from 'rollup-plugin-commonjs'
// print object properties
import util from 'util'
/*
package.json fields
dependencies: object, can be used to build a list of external that are not to be bundled
module field: ?
directories browser code: dist, dist-es
directories Node.js package code: lib
directories Node.js application code: build
directories source code: src
jsnext:main legacy field, replaced by module
main: project-relaive path to CommonJS-style export, default extension .js, if diretcory /index.js
http://www.commonjs.org/ obsolete initiative
*/

// Node.js standard library externals
const nodejsExternals = ['dgram', 'events', 'net', 'os', 'util']

// project specific rollup options
// TODO: should be configured in package.json
const inputOutputExternal = {
  input: 'src/run.js',
  output: [{file: `build/${pkg.name}.js`, format: 'cjs'}],
  external: [].concat(nodejsExternals),
}

// muffle buggy rollup warnings
const warningFilter = {
  onwarn: function (message) {
    if (message) {
      const {code, source, missing} = message
    // https://github.com/rollup/rollup/issues/794
    // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
    /*{ code: 'THIS_IS_UNDEFINED',
      message: 'The \'this\' keyword is equivalent to \'undefined\' at the top level of an ES module, and has been rewritten',
      url: 'https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined',
      pos: 12,
      loc: { file: '/opt/foxyboy/sw/packages/syslogtcp/src/Syslog.js', line: 1, column: 12 },
      frame: '1: var _this = this;\n               ^\n2: \n3: /*',
      id: '/opt/foxyboy/sw/packages/syslogtcp/src/Syslog.js',
      toString: [Function] }
    */
      if (code === 'THIS_IS_UNDEFINED') return
      // https://github.com/rollup/rollup-plugin-babel/issues/13
      if (code === 'UNRESOLVED_IMPORT' && source.startsWith('babel-runtime/')) return
      /*
      { code: 'MISSING_EXPORT',
        missing: 'default',
        importer: '\u0000commonjs-proxy:/opt/foxyboy/sw/node_modules/core-js/library/modules/_object-dp.js',
        exporter: '../../node_modules/core-js/library/modules/_object-dp.js',
        message: '\'default\' is not exported by \'../../node_modules/core-js/library/modules/_object-dp.js\
      '',
        url: 'https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module',
        pos: 137,
        loc:
        { file: '\u0000commonjs-proxy:/opt/foxyboy/sw/node_modules/core-js/library/modules/_object-dp.js',
          line: 1,
          column: 137 },
        frame: '1: import * as _objectDp from "/opt/foxyboy/sw/node_modules/core-js/library/modules/_object-
      dp.js"; export default ( _objectDp && _objectDp[\'default\'] ) || _objectDp;\n

                    ^',
        id: '\u0000commonjs-proxy:/opt/foxyboy/sw/node_modules/core-js/library/modules/_object-dp.js',
        toString: [Function] }
      */
      if (code === 'MISSING_EXPORT' && missing === 'default') return
    }
    console.error(message)
  },
}

// rollup-plugin-node-resolve options: none
// https://www.npmjs.com/package/rollup-plugin-node-resolve
// module field ES6

// rollup-plugin-commonjs options
// https://www.npmjs.com/package/rollup-plugin-commonjs

// rollup-plugin-babel options

const rollupPluginBabelOptions = {
  // https://www.npmjs.com/package/rollup-plugin-babel
  // bundle babel helpers
  // babel helpers are the runtime that allows babel transpiled code to run
  // https://github.com/babel/babel/tree/master/packages/babel-helpers
  runtimeHelpers: true,
  //Babel options: https://babeljs.io/docs/core-packages/#options
  // do not fetch babel options from .babelrc or package.json files
  babelrc: false,
}

// determine running Node.js major version
const matchResult = String(process.version).match(/^v([0-9]+)/)
const num = Number(matchResult && matchResult[1])
const nodeMajorVersion = num > 0 ? num : 0 // 8, default 0
console.log(`Node.js major version: ${nodeMajorVersion} >= 8: ${nodeMajorVersion >= 8}`)

const babelPresetNode8BabelOptions = {
  // Babel Plugin list at https://www.npmjs.com/package/babel-preset-node8
  plugins: [
    //'transform-es2015-modules-commonjs',
    'transform-class-properties',
    'transform-object-rest-spread',
    'transform-export-extensions',
    'transform-async-generator-functions',
    'syntax-trailing-function-commas',
    'transform-es2015-block-scoping',
    ['transform-es2015-for-of', {loose: true}],
    'transform-inline-consecutive-adds',
    'minify-dead-code-elimination',
    // Add-on: post-Node.js 8 ECMAScript features:
    'transform-object-rest-spread',
    // Add-on: babel runtime:
    'external-helpers',
    'transform-runtime',
  ]
}

const babelPresetEnvBabelOptions = {
  // https://babeljs.io/docs/plugins/preset-env/#options
  // includes all transforms up to es2017
  presets: [['env', {
    modules: false,
    target: {node: '4.8'}, // if target is omitted, compiles to ECMAScript 5.1
  }]],
  plugins: [
    // Add-on: post-Node.js 8 ECMAScript features:
    'transform-class-properties',
    'transform-object-rest-spread',
    // Add-on: babel runtime:
    'external-helpers',
    'transform-runtime',
  ]
}

// the rollup configuration object
const babelOptions = Object.assign({},
  rollupPluginBabelOptions,
  nodeMajorVersion >= 8
    ? babelPresetNode8BabelOptions
    : babelPresetEnvBabelOptions,
)
const object = [Object.assign({},
  inputOutputExternal,
  warningFilter,
  {plugins: [
    babel(babelOptions),
    resolve(),
    commonjs({}),
  ]},
)]
console.log('Rollup configuration output for:', __filename)
console.log('Object:', util.inspect(object, {colors: true, depth: null}))
console.log('Babel options:', util.inspect(babelOptions, {colors: true, depth: null}))
export default object