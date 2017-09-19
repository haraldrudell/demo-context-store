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
const config = configIsArray ? [] : getConfig(pkg)
export default config

if (configIsArray) {
  const {rollup: rollup0} = pkg
  let {clean} = rollup0
  const {external: ex} = rollup0
  let notFirstObject
  for (let [input, values] of Object.entries(rollupInput)) {
    const {main: ma, module: mo, external = ex, shebang} = values || false
    const main = ma !== true ? ma : pkg.main
    const module = mo !== true ? mo : pkg.module
    const rollup = {clean, shebang, notFirstObject}
    config.push(getConfig({input, main, module, external, rollup}))
    clean = false
    notFirstObject = true
  }
}

function getConfig({input, main, module, output, external, rollup}) {
  // babel-core https://babeljs.io/docs/core-packages/#options
  const babelCoreOptions = {
    babelrc: false, // do not process package,json or .babelrc files, rollup has the canonical Babel configuraiton
    plugins: [
      babelPrintFilename,
      'transform-class-properties',
      'transform-object-rest-spread',
      'transform-async-generator-functions',
      /*
      rollup output:
      The 'extends' Babel helper is used more than once in your code. It's strongly recommended that you use
      the "external-helpers" plugin or the "es2015-rollup" preset. See https://github.com/rollup/rollup-plugin-babel#configuring-babel for more information
      - es2015-rollup is deprecated
      */
      'external-helpers',
    ],
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
  const rollupBabelOptions = Object.assign({},
    rollupPluginsIncludeExlude,
    babelCoreOptions)

  // rollup-plugin-eslint https://github.com/TrySound/rollup-plugin-eslint
  const rollupEslintOptions = rollupPluginsIncludeExlude

  // resolve https://www.npmjs.com/package/resolve
  const resolveOptions = {
    // some unused requires should fail while Rollup should still succeed
    // this enables for example mock modules solving the problem
    paths: [path.join(projectDir, 'js_modules')], // modules in the js_modules directory will override real modules
  }

  // rollup-plugin-node-resolve https://www.npmjs.com/package/rollup-plugin-node-resolve
  const rollupNodeResolveOptions = Object.assign({
    preferBuiltins: true, // browser-related packages have overrides to Node.js standard library. Ignore those
  }, Object.keys(resolveOptions).length ? {customResolveOptions: resolveOptions} : {})

  const o = {
    input,
    output: getRollupOutput({main, module, output}),
    external,
    onwarn: warningsMuffler,
    plugins: [
      eslint(rollupEslintOptions),
      babelPlugin(rollupBabelOptions),
      json(),
      resolve(rollupNodeResolveOptions),
      commonjs(),
      ].concat(rollup.shebang ? [shebangPlugin(), chmodPlugin()] : [])
      .concat(rollup.clean ? cleanPlugin(rollup.clean) : []),
  }
  deleteUndefined(o)

  if (rollup.print) {
    console.log(`Rollup options for ${input}: ${util.inspect(o, {colors: true, depth: null})}`)
    if (!rollup.notFirstObject) {
      console.log('Babel options:', util.inspect(rollupBabelOptions, {colors: true, depth: null}))
      console.log('Node Resolve  options:', util.inspect(rollupNodeResolveOptions, {colors: true, depth: null}))
    }
  }
  return o
}
