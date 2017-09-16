/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
import {default as babelPlugin} from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import eslint from 'rollup-plugin-eslint'
import json from 'rollup-plugin-json'
import shebangPlugin from 'rollup-plugin-shebang'

import util from 'util'
import fs from 'fs'
console.log(babelPlugin, shebangPlugin)
export default rollupConfigGenerator

// https://www.npmjs.com/package/rollup-plugin-babel
const rollupBabelPluginOptions = {
  include: '**/*.js', // ie. exclude .json
}

// https://babeljs.io/docs/core-packages/#options
const defaultBabelOptions = Object.assign({}, rollupBabelPluginOptions, {
  babelrc: false,
  exclude: 'node_modules/**',
  plugins: [
    'transform-class-properties',
    'transform-object-rest-spread',
  ],
})

// https://www.npmjs.com/package/rollup-plugin-node-resolve
const nodeResolveOptions = {
  preferBuiltins: true,
}

const nodeIgnores = ['assert', 'async_hooks', 'buffer', 'child_process', 'cluster', 'console', 'constants', 'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http2', 'http', 'https', 'inspector', 'internal', 'module', 'net', 'os', 'path', 'process', 'punycode', 'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'sys', 'timers', 'tls', 'tty', 'url', 'util', 'v8', 'vm', 'zlib ']

function rollupConfigGenerator(o) {
  const {babel, iox, print, node, shebang} = o || false
  let babelOptions = !babel
   ? defaultBabelOptions
    : Object.assign({}, rollupBabelPluginOptions, babel)
  const result = Object.assign({
    onwarn: rollupConfigWarningsMuffler,
    plugins: [
      eslint(),
      babelPlugin(babelOptions),
      json(),
      resolve(nodeResolveOptions),
      commonjs(),
    ].concat(shebang ? [shebangPlugin(), chmodPlugin()] : []),
  }, iox)
  if (node) result.external = result.external.concat(nodeIgnores)

  if (print) {
    console.log('Rollup options:', util.inspect(result, {colors: true, depth: null}))
    console.log('Babel options:', util.inspect(babelOptions, {colors: true, depth: null}))
    console.log('Node Resolve  options:', util.inspect(nodeResolveOptions, {colors: true, depth: null}))
  }

  return result
}

function chmodPlugin() {
  return {
    name: 'chmod',
    onwrite: chmodOnWrite,
  }
}

function chmodOnWrite(bundle, data) {
  const filename = bundle && (bundle.file || bundle.dest)
  if (filename) fs.chmodSync(filename, 0o755)
}

function rollupConfigWarningsMuffler(message) {
  if (message) {
    const {code, source} = message
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
  }
  console.error(message)
}
