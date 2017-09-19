/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// ECMAScipt 2015 as supported by rollup. No class properties, async generators or object spread operator
import PackageJson from './PackageJson'
import chmodPlugin from './chmodPlugin'
import warningsMuffler from './warningsMuffler'
import cleanPlugin from './cleanPlugin'
import {getRollupOutput, deleteUndefined} from './output'
import babelPrintFilename from './babelPrintFilename'

import babelPlugin from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import eslint from 'rollup-plugin-eslint'
import json from 'rollup-plugin-json'
import shebangPlugin from 'rollup-plugin-shebang'

import util from 'util'
import fs from 'fs'
import path from 'path'

// read package.json
const projectDir = fs.realpathSync(process.cwd()) // project directory without symlinks
const pkg = new PackageJson(path.join(projectDir, 'package.json')) // cannot be imported because we don’t know where it is
const {input: rollupInput} = pkg
const configIsArray = typeof rollupInput === 'object'
const config = configIsArray ? [] : getConfig(rollupPlugins, pkg)
export default config

const rollupPlugins = getRollupPluginOptions(pkg.rollup.print)

if (configIsArray) {
  const {rollup: rollup0} = pkg
  let {clean} = rollup0
  const {external: ex} = rollup0
  for (let [input, values] of Object.entries(rollupInput)) {
    const {main: ma, module: mo, external = ex, shebang} = values || false
    const main = ma !== true ? ma : pkg.main
    const module = mo !== true ? mo : pkg.module
    const rollup = {clean, shebang}
    config.push(getConfig(rollupPlugins, {input, main, module, external, rollup}))
    clean = false
  }
}

function getConfig(plugins, {input, main, module, output, external, rollup}) {
  const o = {
    input,
    output: getRollupOutput({main, module, output}),
    external,
    onwarn: warningsMuffler,
    plugins: plugins.concat(rollup.shebang ? [shebangPlugin(), chmodPlugin()] : [])
      .concat(rollup.clean ? cleanPlugin(rollup.clean) : []),
  }
  deleteUndefined(o)

  if (rollup.print) console.log(`Rollup options for ${input}: ${util.inspect(o, {colors: true, depth: null})}`)
  return o
}

function getRollupPluginOptions(print) {
  // determine running Node.js major version
  const matchResult = String(process.version).match(/^v([0-9]+)/)
  const num = Number(matchResult && matchResult[1])
  const nodeMajorVersion = num > 0 ? num : 0 // 8, default 0
  console.log(`Node.js major version: ${nodeMajorVersion} >= 8: ${nodeMajorVersion >= 8}`)
  const n8plus = nodeMajorVersion >= 8

  // babel-core https://babeljs.io/docs/core-packages/#options
  const babelCoreOptions = {
    babelrc: false, // do not process package,json or .babelrc files, rollup has the canonical Babel configuraiton
    presets: n8plus ? undefined : [['env', {modules: false}]],
    plugins: (n8plus ? [ // transforms not in Node.js version 8.4
      'transform-class-properties', // class f { a = 1… stage-2 170919
      'transform-object-rest-spread', // {...o} stage-3 170919
      'transform-export-extensions', // export * as ns… export a from… stage-1 170919
      'transform-async-generator-functions', // for await… stage-3 170919
      'transform-es2015-block-scoping',
      ['transform-es2015-for-of', {loose: true}],
      'transform-inline-consecutive-adds',
      'minify-dead-code-elimination',
    ] : []).concat([
      babelPrintFilename,
      'external-helpers', // babel externalized helpers
      // rollup-regenerator-runtime is inserted into the bundle
      // rollup therefore needs rollup-plugin-node-resolve
      // it is an ECMAScript 2015 module, so commonjs is not required
      ['transform-runtime', {helpers: false, polyfill: false,
        moduleName: 'rollup-regenerator-runtime',
      }],
    ]),
  }

  // rollup-plugin-babel https://www.npmjs.com/package/rollup-plugin-babel
  const rollupPluginsIncludeExlude = {
    // default is to include all files, including outside of the project directory
    // if include is present, a file must match to be processed
    // if exclude is present a file must not match to be processes
    // if a pattern does not begin with '/' or '.' it applies only to entries in the project directory
    // include: '**' will limit processing to the project directory
    // a symlink is processed according to its canonical path, ie. true file system location

    // exclude already transpiled code in the project directory's node_module tree
    // node_modules must be excluded because eslint fails transpiled files
    exclude: 'node_modules/**',

      // limit to .js files in the project directory tree
      // json is processed by the rollup plugin. If babel processes json, too, it will fail
      include: '**/*.js',
  }
  const rollupBabelOptions = Object.assign({
      externalHelpers: true,
    },
    rollupPluginsIncludeExlude,
    babelCoreOptions)

  // rollup-plugin-eslint https://github.com/TrySound/rollup-plugin-eslint
  const rollupEslintOptions = rollupPluginsIncludeExlude

  // resolve https://www.npmjs.com/package/resolve
  // resolve is used by rollup-plugin-node-resolve below
  const resolveOptions = {
    // some unused requires should fail while Rollup should still succeed
    // this enables for example mock modules solving the problem
    paths: [path.join(projectDir, 'js_modules')], // modules in the js_modules directory will override real modules
  }

  // rollup-plugin-node-resolve https://www.npmjs.com/package/rollup-plugin-node-resolve
  // if input code accesses modules using node_module directories, rollup-plugin-node-resolve is required
  const rollupNodeResolveOptions = Object.assign({
    preferBuiltins: true, // browser-related packages have overrides to Node.js standard library. Ignore those
  }, Object.keys(resolveOptions).length ? {customResolveOptions: resolveOptions} : {})

  // if imported modules are in common js format (using exports) rollup-plugin-commonjs is required

  if (print) {
    console.log('Babel options:', util.inspect(rollupBabelOptions, {colors: true, depth: null}))
    console.log('Node Resolve  options:', util.inspect(rollupNodeResolveOptions, {colors: true, depth: null}))
  }
    return [
      eslint(rollupEslintOptions),
      babelPlugin(rollupBabelOptions),
      json(), // required for import of .json files
      resolve(rollupNodeResolveOptions),
      commonjs(),
      ]
}
