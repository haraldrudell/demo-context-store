/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// ECMAScipt 2015 as supported by rollup. No class properties, async generators or object spread operator
import PackageJson from './PackageJson'
import chmodPlugin from './chmodPlugin'
import warningsMuffler from './warningsMuffler'
import cleanPlugin from './cleanPlugin'
import getRollupOutput from './output'
import babelPrintFilename from './printFilename'

import babelPlugin from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import eslint from 'rollup-plugin-eslint'
import json from 'rollup-plugin-json'
import shebangPlugin from 'rollup-plugin-shebang'

import util from 'util'
import fs from 'fs'
import path from 'path'

const o = {}
export default o

// read package.json
const projectDir = fs.realpathSync(process.cwd()) // project directory without symlinks
const pkg = new PackageJson(path.join(projectDir, 'package.json')) // cannot be imported because we don’t know where it is
const {input, external, rollup} = pkg

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
const rollupBabelOptions = Object.assign({
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
}, babelCoreOptions)

// rollup-plugin-eslint https://github.com/TrySound/rollup-plugin-eslint
const rollupEslintOptions = rollupBabelOptions

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

Object.assign(o, {
  input,
  output = getRollupOutput({pkg}),
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
})

if (rollup.print) {
  console.log('Rollup options:', util.inspect(o, {colors: true, depth: null}))
  console.log('Babel options:', util.inspect(babelOptions, {colors: true, depth: null}))
  console.log('Node Resolve  options:', util.inspect(rollupNodeResolveOptions, {colors: true, depth: null}))
}
