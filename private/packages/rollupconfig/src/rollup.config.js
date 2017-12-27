/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// ECMAScipt 2015 as supported by rollup. No class properties, async generators or object spread operator
import RollupConfigurator from './RollupConfigurator'
import chmod from './chmodPlugin'
import warningsMuffler from './warningsMuffler'
import cleanPlugin from './cleanPlugin'
import printBabelFilenames from './babelPrintFilename'

import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import eslint from 'rollup-plugin-eslint'
import json from 'rollup-plugin-json'
import shebangPlugin from 'rollup-plugin-shebang'

import util from 'util'
import fs from 'fs'
import path from 'path'
import {Hash} from 'crypto'

export default new RollupConfigurator().assembleConfig(getConfig)

/*
name: non-empty string
input: non-empty string
output: object or array
main, module: string or undefined
clean: array of non-empty string, non-empty string or undefined
print, shebang, nodelatest: boolean
external: array of string or undefined
targets: object or undefined

unlikely to be used:
node: boolean
mainFlag, moduleFlag: boolean, present for array configuration
*/
function getConfig({input, output, external, targets, shebang, clean, print, nodelatest}) {
  const latestNode = targets && targets.node === 'current'
  const includeExclude = {
    /*
    default is to include all files, including outside of the project directory
    if include is present, a file must match to be processed
    if exclude is present a file must not match to be processes
    if a pattern does not begin with '/' or '.' it applies only to entries in the project directory
    include: '**' will limit processing to the project directory
    a symlink is processed according to its canonical path, ie. true file system location

    exclude already transpiled code in the project directory's node_module tree
    node_modules must be excluded because eslint fails transpiled files
    */
    exclude: 'node_modules/**',
    /*
    limit to .js files in the project directory tree
    this exludes for example node_modules in parent directories
    json is processed by the rollup plugin. If babel processes json, too, it will fail
    */
    include: '**/*.js',
  }
  let rollupBabelOptions
  let rollupResolveOptions

  const config = {
    input,
    output,
    external,
    onwarn: warningsMuffler,
    plugins: [
      // rollup-plugin-eslint https://github.com/TrySound/rollup-plugin-eslint
      eslint(includeExclude),
      /*
      rollup-plugin-node-resolve https://www.npmjs.com/package/rollup-plugin-node-resolve
      locates modules in node_module directories and parent node_module directories
      examines module and main fields of package.json
      prefer builtins, like 'util' over same-named other modules
      */
      resolve(rollupResolveOptions = {
        extensions: ['.js', '.json'],
        customResolveOptions: {
          /*
          resolve https://www.npmjs.com/package/resolve
          some unused requires should fail while Rollup should still succeed
          this enables overriding mock modules solving such problems
          */
          paths: [path.join(fs.realpathSync(process.cwd()), 'js_modules')], // modules in the js_modules directory will override real modules
      }}),
      /*
      rollup-plugin-commonjs https://github.com/rollup/rollup-plugin-commonjs
      converts commonJS modules to ECMAScript 2015
      Only processes .js files that are of CommonJS format
      if imported modules are in common js format (using exports) rollup-plugin-commonjs is required
      */
      commonjs(),
      json(), // required for import of .json files
      babel(rollupBabelOptions = Object.assign({
        // rollup-plugin-babel https://www.npmjs.com/package/rollup-plugin-babel
        babelrc: false, // do not process package.json or .babelrc files, rollup has the canonical Babel configuraiton
        // bundle in Babel external helpers https://github.com/rollup/rollup-plugin-babel#usage
        runtimeHelpers: true,
        presets: [['env', {modules: false, targets}]],
        plugins: [
          'external-helpers',
          'transform-class-properties', // class f { a = 1… stage-2 170919
          'transform-object-rest-spread', // {...o} stage-3 170919
          'transform-export-extensions', // export * as ns… export a from… stage-1 170919
          'transform-async-generator-functions', // for await… stage-3 170919
        ].concat(!latestNode ? ['transform-runtime'] : [])
          .concat(print ? [printBabelFilenames] : []),
      }, includeExclude)), // only process files from the project
    ].concat(shebang ? [shebangPlugin(), chmod()] : [])
      .concat(clean ? cleanPlugin(clean) : [])
      .concat(print ?
        [{name: 'sha256Plugin', // a rollup plugin
          onwrite(bundle, data) {
            const {code} = data
            console.log(`${path.basename(bundle.file)} bytes: ${code.length} sha256: ${new Hash('sha256').update(code).digest('hex')}`)
          },
        }] : []),
  }
  RollupConfigurator.deleteUndefined(config)

  if (print) {
    console.log(`Rollup options for ${input}: ${util.inspect(config, {colors: true, depth: null})}`)
    console.log('Node Resolve options:', util.inspect(rollupResolveOptions, {colors: true, depth: null}))
    console.log('Babel options:', util.inspect(rollupBabelOptions, {colors: true, depth: null}))
  }

  return config
}
