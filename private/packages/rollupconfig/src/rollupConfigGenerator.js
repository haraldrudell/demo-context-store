/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
import nodeIgnores from './nodepackages'
import chmodPlugin from './chmodPlugin'

import babelPlugin from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import eslint from 'rollup-plugin-eslint'
import json from 'rollup-plugin-json'
import shebangPlugin from 'rollup-plugin-shebang'

import util from 'util'
import fs from 'fs'
import path from 'path'

export default rollupConfigGenerator

const projectDir = fs.realpathSync(process.cwd())
console.log('projectDir', projectDir)

// https://www.npmjs.com/package/rollup-plugin-babel
const rollupBabelPluginOptions = {
  // default is to include all files, including outside of the project directory
  // if include is present, a file must match to be processed
  // if exclude is present a file must not match to be processes
  // if a pattern does not begin with '/' or '.' it applies only to entries in the project directory
  // include: '**' will limit processing to the project directory
  // include: '**/*.js' will limit processing to .js files in the project directory
  // a symlink is processed according to its canonical path, ie. true file system location
  exclude: 'node_modules/**', // exclude files in the project directory's node_module tree
  include: '**/*.js',
}

// https://babeljs.io/docs/core-packages/#options
const generatorBabelOptions = Object.assign({}, rollupBabelPluginOptions, {
  babelrc: false,
  plugins: [
    function printFilename() {
      return {visitor: {
        Program(nodePass, pluginPass) {
          console.log('source file:', pluginPass.file.opts.filename)
        },
      }}
    },
    'transform-class-properties',
    'transform-object-rest-spread',
    'transform-async-generator-functions',
    /*
    The 'extends' Babel helper is used more than once in your code. It's strongly recommended that you use
    the "external-helpers" plugin or the "es2015-rollup" preset. See https://github.com/rollup/rollup-plu
    gin-babel#configuring-babel for more information
    */
    'external-helpers',
  ],
})

// https://github.com/TrySound/rollup-plugin-eslint
const rollupEslintPluginOptions = rollupBabelPluginOptions

// https://www.npmjs.com/package/resolve
const resolveOptions = {
  paths: [path.join(process.cwd(), 'js_modules')],
  // moduleDirectory: 'js_modules'
}

// https://www.npmjs.com/package/rollup-plugin-node-resolve
const nodeResolveOptions = Object.assign({
  preferBuiltins: true,
}, Object.keys(resolveOptions).length ? {customResolveOptions: resolveOptions} : {})

function rollupConfigGenerator(o) {
  const {babel: consumerBabelOptions, iox, print, node, shebang} = o || false
  let babelOptions = consumerBabelOptions
    ? Object.assign({}, rollupBabelPluginOptions, consumerBabelOptions)
    : generatorBabelOptions

  const result = Object.assign({
    onwarn: rollupConfigWarningsMuffler,
    plugins: [
      eslint(rollupEslintPluginOptions),
      babelPlugin(babelOptions),
      json(),
      resolve(nodeResolveOptions),
      commonjs(),
    ].concat(shebang ? [shebangPlugin(), chmodPlugin()] : []),
  })
  for (let p of ['input', 'output', 'external']) {
    const v = iox[p]
    if (v !== undefined) result[p] = v
  }
  const {plugins} = iox || false
  if (Array.isArray(plugins)) Array.prototype.push.apply(result.plugins, plugins)

  let ex = result.external
  if (node) ex = ex ? ex.concat(nodeIgnores) : nodeIgnores
  if (ex) result.external = Array.from(new Set(ex)).sort()

  if (print) {
    console.log('Rollup options:', util.inspect(result, {colors: true, depth: null}))
    console.log('Babel options:', util.inspect(babelOptions, {colors: true, depth: null}))
    console.log('Node Resolve  options:', util.inspect(nodeResolveOptions, {colors: true, depth: null}))
  }

  return result
}

function rollupConfigWarningsMuffler(messageObject) {
  const m = 'rollupconfig.warningsMuffler:'
  if (messageObject) {
    const {code, source, missing, message} = messageObject
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
    if (code === 'THIS_IS_UNDEFINED') {
      console.log(`${m} rollup issue 794`)
      return
    }
    // https://github.com/rollup/rollup-plugin-babel/issues/13
    if (code === 'UNRESOLVED_IMPORT' && source.startsWith('babel-runtime/')) {
      console.log(`${m} babel issue 13`)
      return
    }
    // https://github.com/rollup/rollup/issues/1408
    if (code === 'MISSING_EXPORT' && missing === 'default' && message.endsWith('es6.object.to-string.js\'')) {
      console.log(`${m} rollup issue 1408`)
      return
    }
  }
  console.error(messageObject)
}
